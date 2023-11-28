import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { DbUserService } from '../../dbUser/service/dbuser.service';
import { BankAccountService } from '../../bank_account/service/bankAccount.service';
const chalk = require('chalk');
chalk.level = 3;

@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: DbUserService,
        private readonly bankAccountService: BankAccountService) {}

    async getAuthorization() {
        // Check id user has enough money on all accounts
        // get user object
        
    }

    async postPayment() {
        
    }
}
