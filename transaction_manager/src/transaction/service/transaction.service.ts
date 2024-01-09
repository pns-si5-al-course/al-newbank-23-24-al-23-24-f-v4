import { Injectable, ConflictException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Payment } from '../../schemas/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

//import chalk from 'chalk';

import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { TransactionDto, TransactionValidationDto } from '../../dto/transaction-validation.dto';

@ApiTags('Transaction service')
@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
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
            console.log('------ Checking payment status ------');
            console.log('existingPayment.status: '+existingPayment.status);

            if(existingPayment.status === 'pending') {
                // Demander une nouvelle vérification
                validationCheck = await this.validationVerification(existingPayment);
                console.log('================= validationCheck: =================');
                console.log(validationCheck);
                console.log('================= ================ =================');
                if (validationCheck.status === 403) {
                    // user has not enough funds
                    console.error(validationCheck.data[1]);
                    console.log('================= ================ =================');
                    console.log('User has not enough funds');
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
                    console.log('================= ================ =================');
                    console.log('Process to transaction and update payment status');
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
            }
            response = {
                message: 'Payment already exists, status was '+existingPayment.status,
                code: validationCheck
            };
            return response;
            //throw new ConflictException('Payment already exists.');
        } else {
            const payment = new Payment(transactionRequest.id, transactionRequest.idUser, transactionRequest.amount, transactionRequest.source_currency, transactionRequest.target_currency, 'pending');
            // Sinon, créer le nouveau paiement
            console.log('------ Creating new payment ------');
            const newPayment = new this.paymentModel(payment);
            await newPayment.save();
    
            // Demander une vérification
            const validationCheck: any = await this.validationVerification(payment);

            if (validationCheck.statusText === 'OK' && !validationCheck.data) {
                // process to transaction and update payment status
                const proc = await this.processorVerification(transactionRequest);
                console.log('------ Processing to transaction ------');
                console.log('proc.status: '+proc.status);

                response = {
                    message: (proc.status === 200) ? 'Payment realized' : 'Error during payment',
                    code: {
                        code: proc.status,
                        text: proc.statusText
                    }
                };
                this.updatePayment(payment, (proc.status === 200) ? 'Payment realized' : 'Error during payment');
            }

            else if (validationCheck.statusText === 'OK' && validationCheck.data) {
                // not enough funds
                if(validationCheck.data[0] === 403){
                    console.error(validationCheck.data[1]);
                    response = {
                        message: 'Payment refused',
                        code: {
                            code: 403,
                            text: validationCheck.data[1]
                        }
                    };
                }
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
        console.log("validationRequest: "+JSON.stringify(validationRequest));
        
        return this.httpService.post<TransactionDto>(validatorUrl+"/transaction/validate", validationRequest)
            .pipe(
                map((response: AxiosResponse<TransactionDto, any>) => {
                    console.log("response: "+response.statusText);
                    return response;
                }),
                catchError((error: AxiosError) => {
                    console.log("error: "+error.response);
                    throw error;
                })
            )
            .pipe(catchError((err) => {
                console.log("err: "+err.response);
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
                    console.log("response from processor: "+response.statusText);
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
}
