import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
import { Account } from './account.entity';

@Entity('user')  // Nom de la table dans la base de données
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    @Column({ type: 'float' })
    total_sold: number;

    @ApiProperty({ type: 'object' })
    @Column({ type: 'json' })
    accounts: Object;

    constructor(id: number, total_sold: number, accounts: Object) {
        this.id = id;
        this.total_sold = total_sold;
        this.accounts = accounts;
    }
}
