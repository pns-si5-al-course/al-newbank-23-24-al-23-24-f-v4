export class Payment {
    id: string;
    idUser: number;
    amount: number;
    source_currency: string;
    target_currency: string;
    idCredited?: string;
}