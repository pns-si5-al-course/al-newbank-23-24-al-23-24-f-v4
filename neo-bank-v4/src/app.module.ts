import { PaymentModule } from './payment/payment.module';
import { DbTransactionModule } from './dbTransction/dbTransaction.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';
import { DbUserModule } from './dbUser/dbUser.module';

@Module({
  imports: [
    PaymentModule, 
    DbTransactionModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RateModule,
    DbUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
