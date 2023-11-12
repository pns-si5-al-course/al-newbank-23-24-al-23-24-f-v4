import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { DbUserService } from '../../dbUser/service/dbuser.service';
import { BankAccountService } from '../../bank_account/service/bankAccount.service';

@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: DbUserService,
        private readonly bankAccountService: BankAccountService) {}

    async getAuthorization(idUser: number, currency: string, amount: number) {
        // Check id user has enough money on all accounts
        // get user object
        const user = await this.userService.findUserById(idUser);
        if(!user){
            return {message : "User not found"};
        }
        let globalSold = 0;
        globalSold += (await this.bankAccountService.getAccount(user.mainAccountID)).sold;
        // get current from EUR to currency
        try {
            const rate = (await axios.get(this.configService.get('transaction_url')+'/rates?base=EUR'));
            console.log(rate.data)
            // get all accounts sold
            for(let acc of Object.keys(user.accountList)){  
                const curr_sold = (await this.bankAccountService.getAccount(user.accountList[acc])).sold * rate.data.rates[acc];
                globalSold += curr_sold;
            }
        } catch (error) {
            console.log(error);
            return {message : "Error while getting rates"};
        }
        
        if (globalSold < amount) {
            return {message : "Payment not authorized"};
        }
        return {message : "Payment authorized", globalSold: globalSold};
    }

    async postPayment(idDebited: string, idCredited: string, amount: number, source_currency: string, target_currency: string) {
        await axios.post(this.configService.get('transaction_url')+'/transactions', {
            newTransaction: new Transaction(idDebited, idCredited, amount, source_currency, target_currency)
        });
    }
}
