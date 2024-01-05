import { Controller } from '@nestjs/common';
import { Post, Body, Get } from '@nestjs/common';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';
import { TransactionService } from '../service/transaction.service';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TransactionDto } from '../../dto/transaction-validation.dto';

@ApiTags('Transaction service')
@Controller()
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post('/payment')
    @ApiResponse({ status: 201, description: 'New payment request created.'})
    @ApiResponse({ status: 409, description: 'Payment already exists.'})
    //@ApiQuery({ name: 'payment', required: true, type: Payment })
    async payment(@Body() payment: TransactionDto) {
        return this.transactionService.payment(payment);
    }

    @Get("/listOfPayments")
    @ApiResponse({ status: 200, description: 'Get list of payments stored in db'})
    async payments(){
        return this.transactionService.getListOfPayment();
    }

    @Post("/deleteRealizedPayments")
    @ApiResponse({ status: 200, description: 'Delete payments with status "realized"'})
    async deleteRealizedPayments(){
        const list = await this.transactionService.getListOfRealizedPayment();
        const listId = list.map((payment: Payment) => payment.id);
        listId.forEach(async (id: string) => { await this.transactionService.deletePaymentById(id) });
        return { deleted: listId.length + " payments deleted" };
    }



}
