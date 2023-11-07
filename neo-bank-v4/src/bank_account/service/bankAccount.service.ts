
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDto } from '../../../dto/create-account.dto';
import { Account } from '../../../schema/account.schema';
import { TransactionDto } from '../../../dto/transaction.dto';

@Injectable()
export class BankAccountService {
    constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) { }

    async getAccount(id: string): Promise<Account> {
        return this.accountModel.findOne({ id: id }).exec();
    }

    async createAccount(account: AccountDto): Promise<Account> {
        const newAccount = new this.accountModel(account);
        return newAccount.save();
    }

    async executeTransaction(transaction: TransactionDto): Promise<Account> {
        const account = await this.accountModel.findOne({ id: transaction.id }).exec();
        if (account) {
            account.sold += transaction.amount;
            return account.save();
        }
    }

}
