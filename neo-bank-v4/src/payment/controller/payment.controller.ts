import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaymentService } from '../service/payment.service';

@Controller()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get("/authorization")
    @ApiQuery({})
    getAuthorization(){
        this.paymentService.getAuthorization();
    }

    @Post("/payment")
    postPayment() {

            this.paymentService.postPayment();
        }
}
