import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserData } from 'src/schema/userData.schema';

@Controller()
export class AuthController {
    constructor(private readonly appService: AuthService) { }

    @Post('auth')
    login(@Body() data: UserData): UserData | any {
        return this.appService.login(data);
    }

}
