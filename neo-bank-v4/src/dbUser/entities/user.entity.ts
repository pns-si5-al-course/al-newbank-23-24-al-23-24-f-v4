import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

@Entity('user')  // Nom de la table dans la base de données
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty()
    @Column({ type: 'float' })
    code: number;
}
