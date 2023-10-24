import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
