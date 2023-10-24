import { DbTransactionModule } from './dbTransction/dbTransaction.module';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';

import { UserModule } from './user/user.module';
import mongodbConfig from 'shared/config/mongodb.configuration';
import { MongooseConfigService } from 'shared/services/mongodb-configuration.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/controller/user.controller';
import { UserService } from './user/service/user.service';


@Module({
  imports: [
    DbTransactionModule,
    ConfigModule.forRoot({
      load: [configuration, mongodbConfig],
      isGlobal: true,
    }),
   //RateModule,
    UserModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
