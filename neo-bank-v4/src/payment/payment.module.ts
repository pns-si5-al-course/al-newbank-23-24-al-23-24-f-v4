import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbUserModule } from '../dbUser/dbUser.module';
import { BankAccountModule } from '../bank_account/bankAccount.module';

@Module({
  imports: [ConfigModule, DbUserModule, BankAccountModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
