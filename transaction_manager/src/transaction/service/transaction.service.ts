import { Injectable, ConflictException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Payment } from '../../schemas/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import Logger  from '../../utilities/logger';

import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { TransactionDto, TransactionValidationDto } from '../../dto/transaction-validation.dto';


const log = Logger.log;
const error = Logger.error;

@ApiTags('Transaction service')
@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        
        ) {}

    @ApiResponse({ status: 201, description: 'New payment request created.'})
    @ApiResponse({ status: 200, description: 'Payment already exists.'})
    public async payment(transactionRequest: TransactionDto): Promise<any> {
        // Rechercher un paiement existant qui correspond aux critères uniques
        let response: {
            message: string,
            code: TransactionValidationDto
        } = {
            message: '',
            code: {
                code: 0,
                text: ''
            }
        };
        const existingPayment = await this.paymentModel.findOne({ id: transactionRequest.id });
        
        if (existingPayment) {
        
            let validationCheck: any ;   
            log('------ Checking payment status ------');
            log('existingPayment.status: '+existingPayment.status);

            if(existingPayment.status === 'pending') {
                // Demander une nouvelle vérification
                validationCheck = await this.validationVerification(existingPayment);
                log('================= validationCheck: =================');
                log(validationCheck);
                log('================= ================ =================');
                if (validationCheck.status === 403) {
                    // user has not enough funds
                    error(validationCheck.data[1]);
                    log('================= ================ =================');
                    log('User has not enough funds');
                    response = {
                        message: 'Payment refused',
                        code: {
                            code: 403,
                            text: validationCheck.data[1]
                        }
                    };
                    //this.updatePaymentStatus(existingPayment, 'Payment Refused');
                } else if (validationCheck.status === 200) {
                    // process to transaction and update payment status
                    log('================= ================ =================');
                    log('Process to transaction and update payment status');
                    const proc = await this.processorVerification(transactionRequest);
                    response = {
                        message: (proc.status === 200) ? 'Payment realized' : 'Error during payment',
                        code: {
                            code: proc.status,
                            text: proc.statusText
                        }
                    };
                    this.updatePayment(existingPayment, (proc.status === 200) ? 'Payment realized' : 'Error during payment');
                }

            } else if (existingPayment.status === 'Payment Authorized') {
                // payment was authorized, but not processed
                const proc = await this.processorVerification(transactionRequest);
                response = {
                    message: (proc.status === 200) ? 'Payment realized' : 'Error during payment',
                    code: {
                        code: proc.status,
                        text: proc.statusText
                    }
                };
                this.updatePayment(existingPayment, (proc.status === 200) ? 'Payment realized' : 'Error during payment');

            } else if (existingPayment.status === 'Payment Refused') {
                validationCheck = {
                    code: 200,
                    text: "Payment already Refused"
                };
            } else if (existingPayment.status === 'Payment realized') {
                validationCheck = {
                    code: 200,
                    text: "Payment already realized"
                };
            } else if (existingPayment.status === 'Payment Simulated') {
                validationCheck = {
                    code: 200,
                    text: "Payment already Simulated"
                };
            }
            response = {
                message: 'Payment already exists, status was '+existingPayment.status,
                code: validationCheck
            };
            return response;
            //throw new ConflictException('Payment already exists.');
        } else {
            const currentTime = new Date().getHours();
            const isSimulatedTime = currentTime >= 21 || currentTime < 6;
            const paymentStatus = isSimulatedTime ? 'Payment Simulated' : 'pending';
        
            log(`Current Time: ${currentTime}, Payment Status Set To: ${paymentStatus}`);
        
            const payment = new Payment(
                transactionRequest.id,
                transactionRequest.idUser,
                transactionRequest.amount,
                transactionRequest.source_currency,
                transactionRequest.target_currency,
                paymentStatus
            );
        
            // Creating a new payment
            log('------ Creating new payment ------');
            const newPayment = new this.paymentModel(payment);
            await newPayment.save();
            log('New Payment Created with Status: ' + paymentStatus);
        
            // Request a verification
            const validationCheck: any = await this.validationVerification(payment);
            log(`Validation Check Status: ${validationCheck.statusText}, Data: ${JSON.stringify(validationCheck.data)}`);
        
            if (validationCheck.statusText === 'OK' && !validationCheck.data) {
                // Process to transaction and update payment status
                const proc = await this.processorVerification(transactionRequest);
                log('------ Processing to transaction ------');
                log(`Processor Verification Status: ${proc.status}, StatusText: ${proc.statusText}`);
        
                // Update the payment status only if it's not 'Payment Simulated'
                if (paymentStatus !== 'Payment Simulated') {
                    response = {
                        message: (proc.status === 200) ? 'Payment realized' : 'Error during payment',
                        code: {
                            code: proc.status,
                            text: proc.statusText
                        }
                    };
                    this.updatePayment(payment, (proc.status === 200) ? 'Payment realized' : 'Error during payment');
                } else {
                    // Keep the status as 'Payment Simulated'
                    response = {
                        message: 'Payment Simulated',
                        code: {
                            code: 200,
                            text: 'Simulated Status'
                        }
                    };
                }
            } else if (validationCheck.statusText === 'OK' && validationCheck.data) {
                // Not enough funds
                if (validationCheck.data[0] === 403) {
                    console.error(`Payment Refused: ${validationCheck.data[1]}`);
                    response = {
                        message: 'Payment refused',
                        code: {
                        code: 403,
                        text: validationCheck.data[1]
                    }
                };}
        
            }
            return response;
            }
    }
        
            
    private async validationVerification(payment: Payment): Promise<any> {
        return await firstValueFrom(await this.askForValidation(payment));
    }

    private async askForValidation(payment: Payment): Promise<Observable<AxiosResponse<TransactionDto, any>>> {
        const validatorUrl = this.configService.get('validator_url');
        const validationRequest: TransactionDto = {
            id: payment.id,
            idUser: payment.idUser,
            amount: payment.amount,
            source_currency: payment.source_currency,
            target_currency: payment.target_currency,
        }
        log("INFO ValidationRequest: "+JSON.stringify(validationRequest));
        
        return this.httpService.post<TransactionDto>(validatorUrl+"/transaction/validate", validationRequest)
            .pipe(
                map((response: AxiosResponse<TransactionDto, any>) => {
                    log("INFO : response -> "+response.statusText);
                    return response;
                }),
                catchError((error: AxiosError) => {
                    log("ERROR : error -> "+error.response);
                    throw error;
                })
            )
            .pipe(catchError((err) => {
                error("ERROR : err -> "+err.response);
                throw new ConflictException(err.response.data);
            }));
    }

    private async processorVerification(transaction: TransactionDto): Promise<any> {
        return await firstValueFrom(await this.processToTransaction(transaction));
    }

    private async processToTransaction(transaction: TransactionDto): Promise<Observable<AxiosResponse<TransactionDto, any>>> {
        return this.httpService.post<TransactionDto>(this.configService.get('processor_url')+"/transactions", transaction)
            .pipe(
                map((response: AxiosResponse<TransactionDto, any>) => {
                    log("INFO : response from processor: "+response.statusText);
                    return response;
                }),
                catchError((error: AxiosError) => {
                    throw error;
                })
            )
            .pipe(catchError(() => {
                throw new ConflictException('API Processor not available');
            }));
    }


    async getListOfPayment(){
        return this.paymentModel.find();
    }

    async updatePayment(payment: Payment, status: string): Promise<any>{
        const existingPayment = await this.paymentModel.findOne({ id: payment.id });
        existingPayment.status = status;
        return existingPayment.save(); 
    }

    async getListOfRealizedPayment(){
        // we will use this to delete realized payments periodically
        return this.paymentModel.find({status: 'Payment realized'});
    }

    async getPaymentById(id: string){
        return this.paymentModel.findOne({id: id});
    }

    async deletePaymentById(id: string){
        return this.paymentModel.deleteOne({id: id});
    }



    async handleSimulatedPayments(): Promise<any> {
        const simulatedPayments = await this.paymentModel.find({ status: 'Payment Simulated' });
        log(`Found ${simulatedPayments.length} simulated payments to process`);
    
        for (let payment of simulatedPayments) {
            log(`Processing simulated payment with ID: ${payment.id}`);
    
            const exchangeRequest = {
                source_currency: payment.source_currency,
                target_currency: payment.target_currency,
                amount: payment.amount
            };
    
            try {
                const exchangeResponse = await firstValueFrom(
                    this.httpService.post('http://stock_exchange:8000/exchange', exchangeRequest)
                );
    
                payment.amount = exchangeResponse.data.converted_amount;
                await this.updatePayment(payment, 'Payment realized');
                log(`Payment ID: ${payment.id} updated with converted amount: ${payment.amount}`);
            } catch (error) {
                error(`Error processing payment ID: ${payment.id}, Error: ${error}`);
            }
        }
    
        return { processed: simulatedPayments.length + " simulated payments processed" };
    }
          

}
