import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbUserService } from './dbUser/service/dbuser.service';

@Injectable()
export class AppService implements OnModuleInit {
  getHello(): string {
    return 'Welcome to Neo Bank v-4 !';
  }

  constructor(
    private readonly dbUserService: DbUserService
    ) {}

  async onModuleInit() {
    console.log(`Create bankAdminUser with his bank accounts`);

    //check if bankAdminUser already exists
    const bankAdminUser = await this.dbUserService.findUserByName("BankAdmin");
    console.log(bankAdminUser);
    if(bankAdminUser.length !== 0){
      console.log(`BankAdmin already exists`);
      return;
    }

    this.dbUserService.registerAdminBankAccount({
      id: 1,
      name: "BankAdmin",
      code: 1234,
    });
  }
}
