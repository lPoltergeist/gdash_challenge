import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserData } from 'src/schema/userData.schema';
import express from 'express';
import { PassThrough } from 'stream';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('api/auth/login')
    async login(@Body() data: UserData, @Res({ passthrough: true }) res: express.Response): Promise<UserData | any> {
        const result = await this.authService.login(data);

        if ('error' in result) return { error: result.error }

        res.cookie('token', result.token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
            path: '/'
        })

        return result.user
    }

    @Get('api/auth/logout')
    async logout(@Req() req: express.Request) {
        const token = req.cookies['token']
        this.authService.logout(token)
    }

    @Get('api/auth/me')
    async isAuthenticated(@Req() req: express.Request) {
        const token = req.cookies['token']
        if (!token) throw new UnauthorizedException
        return this.authService.isAuthenticated(token)
    }

    @Get('api/debug-cookies')
    debugCookies(@Req() req: any) {
        console.log("COOKIES RECEBIDOS:", req.cookies);
        return req.cookies;
    }

}
