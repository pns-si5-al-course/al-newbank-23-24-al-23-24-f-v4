import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsArray, IsNumber, isNotEmpty, IsNotEmptyObject, IsObject } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    code: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    mainAccountID: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    account_list: Record<string, string>;
}
