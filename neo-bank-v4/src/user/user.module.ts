import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "schema/user.schema";

@Module({
    imports: [HttpModule, 
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers: [UserController],
    providers: [UserService],
    exports: []
})

export class UserModule {};