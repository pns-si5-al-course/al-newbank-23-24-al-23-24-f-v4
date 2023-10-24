import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDto } from "../../../dto/create-user.dto";
import { User } from "../../../schema/user.schema";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(user: UserDto): Promise<any> {
      const newUser = new this.userModel(user);
      return newUser.save();
    };

    async getUsers(): Promise<User[]> {
      return this.userModel.find().exec();        
    }
}