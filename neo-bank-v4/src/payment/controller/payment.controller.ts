import { Controller, Get, Post, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaymentService } from '../service/payment.service';
import { PaymentDto } from '../../../dto/payment.dto';

@Controller()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post("/paymentRequest")
    @HttpCode(HttpStatus.OK)
    //add Body
    async paymentRequest(@Body() body: PaymentDto) {
        try {
            await this.paymentService.paymentRequest(body);
            return;
        } catch (error) {
            throw error;
        }
    }
}
