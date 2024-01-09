export class Payment {
    id: string;
    idDebited: string;
    idCredited: string;
    amount: number;
    currency: string;
    date: Date;

    constructor(id: string, amount: number, date: Date) {
        this.id = id;
        this.amount = amount;
        this.date = date;
    }
}