import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
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



}
