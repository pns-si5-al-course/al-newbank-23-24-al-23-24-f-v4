import { Injectable, OnModuleInit } from '@nestjs/common';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService implements OnModuleInit {
  getHello(): string {
    return 'Welcome to Neo Bank v-4 !';
  }

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    console.log(`Create bankAdminUser with his bank accounts`);
    // Create bankAdminUser with his bank accounts
    await axios.post(this.configService.get('account_url')+'/users/registerAdminBankAccount', {
      id: new UUID().toString(),
      name: "BankAdmin",
      code: 666
    })
  }
}
