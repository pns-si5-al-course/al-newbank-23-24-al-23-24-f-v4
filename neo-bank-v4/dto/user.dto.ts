import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsNotEmpty, IsString, IsArray, IsNumber, isNotEmpty, IsNotEmptyObject } from 'class-validator';
import { AccountDto } from "./account.dto";

export class UserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    total_sold: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    accounts: Object;

}
