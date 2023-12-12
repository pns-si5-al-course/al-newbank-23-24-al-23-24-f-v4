import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { DbUserService } from '../../dbUser/service/dbuser.service';
import { BankAccountService } from '../../bank_account/service/bankAccount.service';
import { PaymentDto } from '../../../dto/payment.dto';
const chalk = require('chalk');
chalk.level = 3;

@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: DbUserService,
        private readonly bankAccountService: BankAccountService) {}

    async paymentRequest(body: PaymentDto) {
        console.log(chalk.blue("PaymentService.paymentRequest()"));
        console.log(chalk.blue("body:"));
        console.log(chalk.blue(body));
        console.log(chalk.blue("body.userId:"));
        console.log(chalk.blue(body.idUser));
        console.log(chalk.blue("body.amount:"));
        console.log(chalk.blue(body.amount));
        console.log(chalk.blue("body.sourceCurrency:"));
        console.log(chalk.blue(body.source_currency));
        console.log(chalk.blue("body.targetCurrency:"));
        console.log(chalk.blue(body.target_currency));
        let user = await this.userService.findUserById(body.idUser);
        console.log(chalk.blue("user:"));
        console.log(chalk.blue(user));
    
        console.log(chalk.blue("transaction:"));
        console.log(chalk.blue("payment:"));
        

        try {
            const response = await axios.post(this.configService.get<string>('TRANSACTION_MANAGER_URL') + '/payment', body);
            if (response.status === 403) {
                console.log(chalk.red("Payment refused"));
                throw new HttpException('Payment refused', HttpStatus.FORBIDDEN);
            }
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status);
        }
        console.log(chalk.green("Payment accepted"));
        return
    }
}
