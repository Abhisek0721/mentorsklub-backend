import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/users.model";
import { DATABASE_NAME } from "@constants/index";
import { Model } from "mongoose";


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name, DATABASE_NAME) private userModel: Model<User>,
    ) {}

    async userExist(email: string):Promise<boolean> {
        const isUser = await this.userModel.exists(
            {
                email: email
            }
        );
        if(isUser) {
            return true;
        }
        return false;
    }

    async getUser(email: string):Promise<User> {
        const user = await this.userModel.findOne({email: email});
        return user;
    }
}