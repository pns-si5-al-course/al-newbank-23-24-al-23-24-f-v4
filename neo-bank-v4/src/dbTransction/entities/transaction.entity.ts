import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction')  // Nom de la table dans la base de données
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    type: string;

    @Column({ type: 'varchar', length: 255 })
    idDebited: string;

    @Column({ type: 'varchar', length: 255 })
    idCredited: string;

    @Column({ type: 'float' })
    amount: number;

    @Column({ type: 'varchar', length: 255 })
    currency: string;

    @Column({ type: 'date', length: 255 })
    date: Date;

}
