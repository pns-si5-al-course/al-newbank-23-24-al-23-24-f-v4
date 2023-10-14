import { DbTransactionService } from './service/dbtransaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { DbTransactionController } from './controller/dbTransaction.controller';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Transaction],
      synchronize: true, // TODO: A enlever en prod
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [DbTransactionController],
  providers: [DbTransactionService],
})
export class DbTransactionModule {}
