import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')  // Nom de la table dans la base de données
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'float' })
    code: number;
}
