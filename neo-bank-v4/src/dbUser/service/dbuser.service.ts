import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BankAccountService } from '../../bank_account/service/bankAccount.service';
import { Account } from '../../../schema/account.schema';
import { currencyCode } from '../../../shared/constant';
import { v4 as uuidv4 } from 'uuid';
const chalk = require('chalk');
chalk.level = 3;

@Injectable()
export class DbUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly bankAccountService: BankAccountService
      ) {}


    private async createBankAccount(user_id: number, sold: number, currency: string){
        const account_id = uuidv4();
        return this.bankAccountService.createAccount({id: account_id, userId: user_id.toString(), sold: sold, currency: currency, payments: []});
    }

    public async calculateTotalSold(user_id: number): Promise<void>{
        const user = await this.findUserById(user_id);
        let total = 0;
        for(let account in user.accounts){
            const account_data = await this.bankAccountService.getAccount(user.accounts[account]);
            total += account_data.sold;
        }
        user.total_sold = total;
        await this.updateUser(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async registerUser(user: User): Promise<User> {
        console.log(chalk.green("Registering user "+user.id));
        const account = await this.createBankAccount(user.id, 0, "EUR");
        console.log(chalk.green("Creating base account for: "+user.id+" with id: "+account.id));
        const new_user = new User(user.id, user.total_sold, user.accounts);
        return this.userRepository.save(new_user);
    }

    async registerAdminBankAccount(user: User): Promise<User> {
        const account = await this.createBankAccount(1, 10_000_000_000, "EUR");
        let account_list = [];
        for(let i = 0; i < currencyCode.length; i++){
            if(currencyCode[i] !== "EUR"){
                const account_id_curr = uuidv4();
                const accountData: Account = {
                    id: account_id_curr,
                    userId: "1",
                    sold: 1_000_000,
                    currency: currencyCode[i],
                    payments: []
                };
                this.bankAccountService.createAccount(accountData);
                user.total_sold += 1_000_000;
                account_list[currencyCode[i]] = account_id_curr;
            }
        }
        const new_user = new User(user.id, user.total_sold, account_list);
        return this.userRepository.save(new_user);
    }

    async updateUser(user: User): Promise<User> {
        const userToUpdate = await this.userRepository.findOne({
            where:{id: user.id}
        });
        if(userToUpdate){
            userToUpdate.accounts = user.accounts;
            return await this.userRepository.save(userToUpdate);
        }
    }

    async findUserById(id: number, order?: any): Promise<User> {
        // should return only one user
        console.log(chalk.green("...Finding user with id: "+id));
        return await this.userRepository.findOne({
            where: {id: id},
            order: order
        });
    }

}
