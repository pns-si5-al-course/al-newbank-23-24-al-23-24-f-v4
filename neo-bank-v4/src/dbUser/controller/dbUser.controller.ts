import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbUserService } from '../service/dbuser.service';
import { User } from '../../entities/user.entity';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserDto } from '../../../dto/user.dto';

@ApiTags('users')
@Controller('users')
export class DbUserController {
    constructor(private readonly dbUserService: DbUserService) {}

    // Route pour récupérer tous les users ou filtrer par paramètres de requête
    @Get()
    @ApiQuery({ name: 'id', required: false, type: Number })
    async find(
        @Query('id') id?: number,
    ) {
        return await this.dbUserService.findUserById(id);
    }

    //Route pour récupérer un user avec un name et un code
    @Get('connexion')
    async connexion(
        @Query('id') id: number,
    ) {
        return this.dbUserService.findUserById(id);
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
    async updateUser(@Body() user: UserDto){
        return this.dbUserService.updateUser(user);
    }
}
