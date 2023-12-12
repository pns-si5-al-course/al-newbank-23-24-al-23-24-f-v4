import { Account } from '../../../schema/account.schema';
import { BankAccountService } from '../service/bankAccount.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionDto } from '../../../dto/transaction.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PaymentDto } from '../../../dto/payment.dto';

@ApiTags('accounts')
@Controller("accounts")
export class BankAcountController {
    constructor(private readonly bankAccountService: BankAccountService) { }

    @Get('/user/:id')
    async getAccountsByUserId(@Param('id') id: string) : Promise<Account[]> {
        return this.bankAccountService.getAccountsByUserId(id);
    }

    @Get()
    async getAccount(@Query('id') id: string) {
        return this.bankAccountService.getAccount(id);
    }

    @Post()
    async postNewAccount(@Body() account: Account) {
        return this.bankAccountService.createAccount(account);
    }

    @Post("/executeTransaction")
    async executeTransaction(@Body() transaction: TransactionDto){
        return this.bankAccountService.executeTransaction(transaction);
    }

}
