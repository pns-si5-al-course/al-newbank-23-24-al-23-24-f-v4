import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbTransactionService } from '../service/dbtransaction.service';

@Controller('transactions')
export class DbTransactionController {
    constructor(private readonly dbTransactionService: DbTransactionService) {}

    // Route pour récupérer toutes les transactions ou filtrer par paramètres de requête
    @Get()
    async find(
        @Query('id') id?: number,
        @Query('idDebited') idDebited?: string,
        @Query('idCredited') idCredited?: string,
        @Query('date') date?: Date,
        @Query('currency') currency?: string,
        @Query('type') type?: string
    ) {
        if (id) return this.dbTransactionService.findTransactionById(id);
        if (idDebited) return this.dbTransactionService.findTransactionByDebitedId(idDebited);
        if (idCredited) return this.dbTransactionService.findTransactionByCreditedId(idCredited);
        if (date) return this.dbTransactionService.findTransactionByDate(date);
        if (currency) return this.dbTransactionService.findTransactionByCurrency(currency);
        if (type) return this.dbTransactionService.findTransactionByType(type);

        return this.dbTransactionService.findAll();
    }

    @Post()
    async registerTransaction(@Body() transaction: any){
        return this.dbTransactionService.registerTransaction(transaction);
    }
}
