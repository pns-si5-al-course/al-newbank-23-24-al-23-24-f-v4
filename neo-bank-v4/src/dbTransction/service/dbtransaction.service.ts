/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DbTransactionService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
      ) {}
    
    async findAll(): Promise<Transaction[]> {
        return this.transactionRepository.find();
    }

    async registerTransaction(transaction: Transaction): Promise<Transaction> {
        return this.transactionRepository.save(transaction);
    }

    async findTransactionById(id: number, order?: any): Promise<Transaction> {
        // should return only one transaction
        return this.transactionRepository.findOne({
            where: {id: id},
            order: order
        });
    }

    async findTransactionByDebitedId(idDebited: string, order?: any): Promise<Transaction[]> {
        // could return multiple transactions 
        return this.transactionRepository.find({
            where: {idDebited: idDebited},
            order: order
        });
    }

    async findTransactionByCreditedId(idCredited: string, order?: any): Promise<Transaction[]> {
        // could return multiple transactions 
        return this.transactionRepository.find({
            where: {idCredited: idCredited},
            order: order
        });
    }

    async findTransactionByDate(date: Date, order?: any): Promise<Transaction[]> {
        // could return multiple transactions 
        return this.transactionRepository.find({
            where: {date: date},
            order: order
        });
    }

    async findTransactionByCurrency(currency: string, order?: any): Promise<Transaction[]> {
        // could return multiple transactions 
        return this.transactionRepository.find({
            where: {currency: currency},
            order: order
        });
    }

    async findTransactionByType(type: string, order?: any): Promise<Transaction[]> {
        // could return multiple transactions 
        return this.transactionRepository.find({
            where: {type: type},
            order: order
        });
    }
}
