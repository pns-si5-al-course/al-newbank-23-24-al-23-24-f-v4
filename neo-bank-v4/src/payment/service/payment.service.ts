import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class PaymentService {
    constructor(private readonly configService: ConfigService) {}

    async getAuthorization(idDebited: string, date: Date, currency: string, amount: number) {
        const account:Account = await axios.get(this.configService.get('account_url')+'/bankAccount/?id='+idDebited);
        if (account.currency !== currency){
            return {message : "Payment not authorized : currency mismatch"};
        }
        if (account.sold < amount) {
            return {message : "Payment not authorized"};
        }
        return {message : "Payment authorized"};
    }

    async postPayment(idDebited: string, idCredited: string, amount: number, source_currency: string, target_currency: string) {
        try {
            await axios.post(this.configService.get('transaction_url')+'/transactions', new Transaction(idDebited, idCredited, source_currency, target_currency, amount));
        } catch (error) {
            console.log(error);
            return {message : "Payment failed"};
        }
    }
}
