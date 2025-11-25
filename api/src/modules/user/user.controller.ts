import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from 'src/schema/userData.schema';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) { }

  @Get('users')
  getUser(): any {
    return this.appService.getUsers();
  }

  @Post('users')
  postWeatherData(@Body() data: UserData) {
    return this.appService.createUser(data);
  }
}
