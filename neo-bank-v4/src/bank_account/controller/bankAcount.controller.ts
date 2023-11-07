import { AccountDto } from '../../../dto/create-account.dto';
import { BankAccountService } from '../service/bankAccount.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionDto } from '../../../dto/transaction.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller("accounts")
export class BankAcountController {
    constructor(private readonly bankAccountService: BankAccountService) { }

    @Get()
    async getAccount(@Query('id') id: string) {
        return this.bankAccountService.getAccount(id);
    }

    @Post()
    async postNewAccount(@Body() account: AccountDto) {
        return this.bankAccountService.createAccount(account);
    }

    @Post("/executeTransaction")
    async executeTransaction(@Body() transaction: TransactionDto){
        return this.bankAccountService.executeTransaction(transaction);
    }

}
