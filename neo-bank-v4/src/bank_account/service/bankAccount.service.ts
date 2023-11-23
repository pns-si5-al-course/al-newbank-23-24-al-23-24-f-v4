
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDto } from '../../../dto/account.dto';
import { Account } from '../../../schema/account.schema';
import { TransactionDto } from '../../../dto/transaction.dto';
import { PaymentDto } from '../../../dto/payment.dto';
const chalk = require('chalk');
chalk.level = 3;

@Injectable()
export class BankAccountService {
    constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) { }

    async getAccount(id: string): Promise<Account> {
        return this.accountModel.findOne({ id: id }).exec();
    }

    async createAccount(account: Account): Promise<Account> {
        const newAccount = new this.accountModel(account);
        console.log(chalk.blue("Creating account for: " + account.id + " with sold: " + account.sold + " " + account.currency))
        return newAccount.save();
    }

    async executeTransaction(payment: PaymentDto): Promise<Account> {
        const account = await this.accountModel.findOne({ id: payment.idDebited }).exec();
        console.log(chalk.blue("Executing transaction for: " + payment.idCredited + " with amount: " + payment.amount))
        if (account) {
            account.sold += payment.amount;
            return account.save();
        }
    }

}
