
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDto } from '../../../dto/create-account.dto';
import { Account } from '../../../schema/account.schema';
import { TransactionDto } from '../../../dto/transaction.dto';
const chalk = require('chalk');


@Injectable()
export class BankAccountService {
    constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) { }

    async getAccount(id: string): Promise<Account> {
        return this.accountModel.findOne({ id: id }).exec();
    }

    async createAccount(account: AccountDto): Promise<Account> {
        const newAccount = new this.accountModel(account);
        console.log(chalk.magenta("Creating account for: " + account.id + " with sold: " + account.sold + " " + account.currency))
        return newAccount.save();
    }

    async executeTransaction(transaction: TransactionDto): Promise<Account> {
        const account = await this.accountModel.findOne({ id: transaction.id }).exec();
        console.log(chalk.magenta("Executing transaction for: " + transaction.id + " with amount: " + transaction.amount))
        if (account) {
            account.sold += transaction.amount;
            return account.save();
        }
    }

}
