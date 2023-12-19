import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionController } from './controller/transaction.controller';
import { HttpModule } from '@nestjs/axios';
import { Payment, PaymentSchema } from '../schemas/payment.schema';

@Module({
  imports: [ConfigModule, 
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    })],
  controllers: [TransactionController],
  providers: [TransactionService]
})

export class TransactionModule {}