export class Transaction{
    idDebited: string;
    idCredited: string;
    amount: number;
    source_currency: string;
    target_currency: string;

    constructor(idDebited: string, idCredited: string, amount: number, source_currency:string, target_currency: string){
        this.idDebited = idDebited;
        this.idCredited = idCredited;
        this.amount = amount;
        this.source_currency = source_currency;
        this.target_currency = target_currency;
    }
}