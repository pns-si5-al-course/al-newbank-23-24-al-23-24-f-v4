import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbUserService } from '../service/dbuser.service';
import { User } from '../entities/user.entity';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserDto } from '../../../dto/create-user.dto';
import { UpdateUserDto } from '../../../dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class DbUserController {
    constructor(private readonly dbUserService: DbUserService) {}

    // Route pour récupérer tous les users ou filtrer par paramètres de requête
    @Get()
    @ApiQuery({ name: 'id', required: false, type: Number })
    @ApiQuery({ name: 'name', required: false, type: String })
    @ApiQuery({ name: 'code', required: false, type: Number })
    async find(
        @Query('id') id?: number,
        @Query('name') name?: string,
        @Query('code') code?: number,
    ) {
        if (id) return this.dbUserService.findUserById(id);
        if (name) return this.dbUserService.findUserByName(name);

        return this.dbUserService.findAll();
    }

    //Route pour récupérer un user avec un name et un code
    @Get('connexion')
    async connexion(
        @Query('name') name: string,
        @Query('code') code: number,
    ) {
        return this.dbUserService.findUserbyNameAndCode(name, code);
    }

    // Route pour créer un user
    @Post()
    @ApiResponse({ status: 201, description: 'The user has been successfully created.'})
    
    async registerUser(@Body() user: UserDto){
        return this.dbUserService.registerUser(user);
    }

    @Post("/registerAdminBankAccount")
    @ApiResponse({ status: 201, description: 'The user has been successfully created.'})
    async registerAdminBankAccount(@Body() user: UserDto){
        return this.dbUserService.registerAdminBankAccount(user);
    }

    // Route pour mettre à jour un user
    @Post('/update')
    async updateUser(@Body() user: UpdateUserDto){
        return this.dbUserService.updateUser(user);
    }
}
