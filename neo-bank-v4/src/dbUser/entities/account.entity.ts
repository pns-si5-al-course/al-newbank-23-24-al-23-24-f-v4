import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('account')  // Nom de la table dans la base de données
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    solde: number;

    @Column({ type: 'varchar', length: 255 })
    currency: string;
}
