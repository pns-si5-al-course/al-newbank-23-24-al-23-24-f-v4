import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsArray, IsNumber, isNotEmpty, IsNotEmptyObject } from 'class-validator';

export class TransactionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    idUser: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    source_currency: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    target_currency: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    idCredited?: string;
}

export class TransactionValidationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    code: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text: string;
}
