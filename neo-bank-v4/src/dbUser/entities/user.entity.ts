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

    @ApiProperty()
    @Column({ type: 'varchar', length: 255 })
    mainAccountID: string;

    @ApiProperty({ type: 'object' })
    @Column({ type: 'json' })
    accountList: Object;

    constructor(id: number, name: string, code: number, mainAccountID: string, accountList: Object) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.mainAccountID = mainAccountID;
        this.accountList = accountList;
    }
}
