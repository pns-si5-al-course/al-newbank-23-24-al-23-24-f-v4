import { BankAcountController } from './bank_account/controller/bankAcount.controller';
import { BankAccountModule } from './bank_account/bankAccount.module';
import { PaymentModule } from './payment/payment.module';
import { DbTransactionModule } from './dbTransction/dbTransaction.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';
import { DbUserModule } from './dbUser/dbUser.module';
import mongodbConfig from '../shared/config/mongodb.configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from '../shared/services/mongodb-configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, mongodbConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    BankAccountModule,
    PaymentModule,
    DbTransactionModule,
    RateModule,
    DbUserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
