import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BankAccountService } from '../../bank_account/service/bankAccount.service';
import { UserDto } from '../../../dto/create-user.dto';
import { currencyCode } from '../../../shared/constant';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from '../../../dto/update-user.dto';
@Injectable()
export class DbUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly bankAccountService: BankAccountService
      ) {}


    private async createBankAccount(sold: number, currency: string){
        const account_id = uuidv4();
        return this.bankAccountService.createAccount({
            id: account_id,
            sold: sold,
            currency: currency
        })
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async registerUser(user: UserDto): Promise<User> {
        const account = await this.createBankAccount(0, "EUR");
        const new_user = new User(user.id, user.name, user.code, account.id, {});
        return this.userRepository.save(new_user);
    }

    async registerAdminBankAccount(user: UserDto): Promise<User> {
        const account = await this.createBankAccount(10000000000000, "EUR");
        let account_list = {};
        for(let i = 0; i < currencyCode.length; i++){
            if(currencyCode[i] !== "EUR"){
                const account_id_curr = uuidv4();
                this.bankAccountService.createAccount({
                    id: account_id_curr,
                    sold: 10000000000000,
                    currency: currencyCode[i]
                })
                account_list[currencyCode[i]] = account_id_curr;
            }
        }
        const new_user = new User(user.id, user.name, user.code, account.id, account_list);
        return this.userRepository.save(new_user);
    }

    async updateUser(user: UpdateUserDto): Promise<User> {
        return this.userRepository.save(user);
    }

    async findUserById(id: number, order?: any): Promise<User> {
        // should return only one user
        return this.userRepository.findOne({
            where: {id: id},
            order: order
        });
    }

    async findUserByName(name: string, order?: any): Promise<User[]> {
        // could return multiple users 
        return this.userRepository.find({
            where: {name: name},
            order: order
        });
    }

    async findUserbyNameAndCode(name: string, code: number, order?: any): Promise<User> {
        // should return only one user
        return this.userRepository.findOne({
            where: {code: code, name: name},
            order: order
        });
    }
}
