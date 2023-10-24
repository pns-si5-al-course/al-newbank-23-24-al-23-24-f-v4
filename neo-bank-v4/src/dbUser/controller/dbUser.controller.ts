import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbUserService } from '../service/dbuser.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class DbUserController {
    constructor(private readonly dbUserService: DbUserService) {}

    // Route pour récupérer tous les users ou filtrer par paramètres de requête
    @Get()
    async find(
        @Query('id') id?: number,
        @Query('name') name?: string,
    ) {
        if (id) return this.dbUserService.findUserById(id);
        if (name) return this.dbUserService.findUserByName(name);

        return this.dbUserService.findAll();
    }

    @Post()
    async registerUser(@Body() user: User){
        return this.dbUserService.registerUser(user);
    }
}
