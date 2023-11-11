import { BankAcountController } from './controller/bankAcount.controller';
import { BankAccountService } from './service/bankAccount.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from '@nestjs/common';
import { Account, AccountSchema } from '../../schema/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
  controllers: [BankAcountController],
  providers: [BankAccountService],
  exports: [BankAccountService]
})
export class BankAccountModule {}
