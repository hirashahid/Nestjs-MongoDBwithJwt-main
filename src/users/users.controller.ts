import { Controller, Post, Body, Get, Patch, Delete, Request, UseGuards } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { UsersServices } from "./users.service";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersServices, private authService: AuthService) { }

    @Post('/register')
    async addUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
        @Body('name') userName: string,
        @Body('gender') userGender: string,
    ) {
        console.log(`At controller, ${userName}, ${userGender}, `);
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        const generatedId = await this.usersService.insertUser(userEmail, hashedPassword, userName, userGender);
        return { id: generatedId };
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        console.log(req.body)
        return this.authService.login(req.body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers() {
        return await this.usersService.getUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return await this.usersService.getProfile(req.user.email, req.user.password);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
        @Body('name') userName: string,
        @Body('gender') userGender: string,
        @Request() req
    ) {
        const updatedUser = await this.usersService.updateUser(req.user, userEmail, userPassword, userName, userGender,);
        console.log(JSON.stringify(updatedUser));
        return 'updated';
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteProduct(@Body('email') userEmail: string,) {
        await this.usersService.deleteUser(userEmail);
        return null;
    }

}
