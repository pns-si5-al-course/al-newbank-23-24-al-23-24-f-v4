/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DbUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async registerUser(user: User): Promise<User> {
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

    async findUserByCode(code: number, order?: any): Promise<User> {
        // could return multiple users 
        return this.userRepository.findOne({
            where: {code: code},
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
