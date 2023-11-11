import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { UserDto } from '../../../dto/create-user.dto';
import { currencyCode } from '../../../shared/constant';
@Injectable()
export class DbUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService
      ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async registerUser(user: UserDto): Promise<User> {
        const account_id = new UUID().toString();
        await axios.post(this.configService.get('account_url')+'/bankAccount', {
            id: account_id,
            sold: 0,
            currency: "EUR"
        })
        const new_user = new User(user.id, user.name, user.code, account_id, []);
        return this.userRepository.save(new_user);
    }

    async registerAdminBankAccount(user: UserDto): Promise<User> {
        const account_id = new UUID().toString();
        await axios.post(this.configService.get('account_url')+'/bankAccount', {
            id: account_id,
            sold: 10000000000000,
            currency: "EUR"
        })
        let account_list = [];
        for(let i = 0; i < currencyCode.length; i++){
            if(currencyCode[i] !== "EUR"){
                const account_id_curr = new UUID().toString();
                await axios.post(this.configService.get('account_url')+'/bankAccount', {
                    id: account_id_curr,
                    sold: 10000000000000,
                    currency: currencyCode[i]
                })
                account_list.push(account_id_curr);
            }
        }
        const new_user = new User(user.id, user.name, user.code, account_id, account_list);
        return this.userRepository.save(new_user);
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
