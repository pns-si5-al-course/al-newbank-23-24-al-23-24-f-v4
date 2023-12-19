import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';

import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';

import mongodbConfig from '../shared/config/mongodb.configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from '../shared/services/mongodb-configuration.service';

import { MetricsMiddleware } from './metrics/metrics.middleware';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, mongodbConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      imports: [ConfigModule],
    }),
    TransactionModule
  ],
  controllers: [AppController, MetricsController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
