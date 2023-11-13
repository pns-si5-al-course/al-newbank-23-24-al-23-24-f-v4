export class Transaction{
    idUser: number;
    idDebited: string;
    idCredited: string;
    source_currency: string;
    target_currency: string;
    amount: number;

    constructor(idUser: number, idDebited: string, idCredited: string, source_currency:string, target_currency: string, amount: number){
        this.idUser = idUser;
        this.idDebited = idDebited;
        this.idCredited = idCredited;
        this.source_currency = source_currency;
        this.target_currency = target_currency;
        this.amount = amount;
    }
}