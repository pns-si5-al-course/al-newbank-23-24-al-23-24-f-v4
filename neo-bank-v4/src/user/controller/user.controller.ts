import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { UserDto } from "../../../dto/create-user.dto";
import { UserService } from "../service/user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(200)
    getStatus() {
      return {status: "OK"};
    }

    @Post("new")
    @HttpCode(201)
    async postUserData(@Body() body: UserDto) {
        console.log(body)
        return this.userService.createUser(body);
    }

    @Get("user")
    @HttpCode(200)
    async getUserData() {
        const data = await this.userService.getUsers()
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return {message: "No user found"}
        });
        return data;
    }
}