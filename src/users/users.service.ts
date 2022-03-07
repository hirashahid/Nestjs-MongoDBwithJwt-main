import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt';

import { User } from "./user.model";

@Injectable()
export class UsersServices {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    async insertUser(email: string, password: string, name: string, gender: string) {
        const user = await this.userModel.findOne({ email });
        if (user) {
            return {
                "message": "User Already Exist",
                "data": "Access Data Empty"
            };
        }
        else {
            const newUser = new this.userModel({
                email,
                password,
                name,
                gender,
            });
            await newUser.save();
            return {
                "message": "User has been registered",
                "data": {
                    email: newUser.email,
                    name: newUser.name,
                    gender: newUser.gender,
                }
            };
        }
    }

    async getProfile(email: string, password: string): Promise<any> {
        const user = await this.findUser(email, password);
        return {
            email: user.email,
            name: user.name,
            gender: user.gender,
        }
    }

    async getUsers(): Promise<any> {
        const users = await this.userModel.find().exec();
        return users.map((user) => ({
            email: user.email,
            name: user.name,
            gender: user.gender,
        }));
    }
    async deleteUser(userEmail: string) {
        const result = await this.userModel.deleteOne({ email: userEmail }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Could not find user');
        }
    }

    async updateUser(euser: User, userEmail: string, password: string, userName: string, gender: string) {
        const email = euser.email;
        const user = await this.userModel.findOne({ email }).exec();
        const updatedUser = await this.updateSingleUser(user, userEmail, password, userName, gender);
        updatedUser.save();
        return updatedUser;
    }

    private async updateSingleUser(user: User, email: string, password: string, userName: string, gender: string): Promise<User> {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            user.password = hashedPassword;
        }
        if (userName) {
            user.name = userName;
        }
        if (gender) {
            user.gender = gender;
        }
        if (email) {
            user.email = email;
        }
        return user;
    }

    async findUser(email: string, password: string): Promise<User | undefined> {
        let user;
        try {
            user = await this.userModel.findOne({ email }).exec();
            if (!await bcrypt.compare(password, user.password)) {
                throw new NotFoundException('Password incorrect');
            }
        } catch (error) {
            throw new NotFoundException('Could not find user');
        }
        if (!user) {
            throw new NotFoundException('Could not find user');
        }
        return user;
    }
}