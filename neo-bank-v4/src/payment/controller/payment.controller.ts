import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaymentService } from '../service/payment.service';

@Controller()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get("/authorization")
    @ApiQuery({ name: 'currency', required: false, type: String })
    getAuthorization(
        @Query('idUser') idUser: number,
        @Query('currency') currency: string,
        @Query('amount') amount: number) {

        return this.paymentService.getAuthorization(idUser, currency, amount);
    }

    @Post("/payment")
    postPayment(
        @Query('idUser') idUser: number,
        @Query('idDebited') idDebited: string,
        @Query('idCredited') idCredited: string,
        @Query('source_currency') source_currency: string,
        @Query('target_currency') target_currency: string,
        @Query('amount') amount: number) {

            this.paymentService.postPayment(idUser,idDebited, idCredited, amount, source_currency, target_currency);
        }
}
