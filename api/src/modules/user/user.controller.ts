import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from 'src/schema/userData.schema';
import { CreateUserDto } from 'src/DTO/createUser';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('api/users')
  getUser(): any {
    return this.userService.getUsers();
  }

  @Post('api/users')
  postUserData(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Delete('/api/users/:id')
  deleteUserData(@Param('id') id: string) {
    return this.userService.deleteUser(id)
  }

  @Put('/api/users/:id')
  updateUserData(@Param('id') id: string, @Body() data: UserData) {
    return this.userService.updateUser(id, data)
  }
}
