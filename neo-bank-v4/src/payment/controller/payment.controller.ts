import { Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

@Controller()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get("/authorization")
    getAuthorization(
        @Query('idDebited') idDebited: string,
        @Query('date') date: Date,
        @Query('currency') currency: string,
        @Query('amount') amount: number) {
        // TODO: implement
        // checks if the user is authorized to make a payment
        // does he have enough money on his account?

        this.paymentService.getAuthorization(idDebited, date, currency, amount);
    }

    @Post("/payment")
    postPayment(
        @Query('idDebited') idDebited: string,
        @Query('idCredited') idCredited: string,
        @Query('date') date: Date,
        @Query('source_currency') source_currency: string,
        @Query('target_currency') target_currency: string,
        @Query('amount') amount: number) {

            this.paymentService.postPayment(idDebited, idCredited, amount, source_currency, target_currency);
        }
}
