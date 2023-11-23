import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('account')  // Nom de la table dans la base de données
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    solde: number;

    @Column({ type: 'varchar', length: 255 })
    currency: string;

    @Column({ type: 'integer', length: 255 })
    user_id: number;

    @Column({ type: 'array', length: 255 })
    payments: string[];

    constructor(id: number, solde: number, currency: string, user_id: number, payments: string[]) {
        this.id = id;
        this.solde = solde;
        this.currency = currency;
        this.user_id = user_id;
        this.payments = payments;
    }
}
