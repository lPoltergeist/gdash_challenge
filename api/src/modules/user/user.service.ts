import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserData, UserDataDocument } from '../../schema/userData.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserData.name) private userModel: Model<UserDataDocument>, private jwtService: JwtService) { }

  async onModuleInit() {
    await this.defaultAdmin()
  }

  private createToken(user: UserData): string {
    const payload = { email: user.email, name: user.name, uuid: randomUUID() };
    return this.jwtService.sign(payload);
  }

  getUsers(): Promise<UserData | any> {
    let userData: Promise<UserData | any>;

    userData = this.userModel.find().exec();
    return userData;
  }

  async createUser(data: UserData): Promise<UserData[] | any> {
    const usersData = await this.userModel.findOne({ email: data.email }).exec();

    if (usersData) throw new BadRequestException('Email já cadastrado!');

    const userData = {
      email: data.email,
      name: data.name,
      password: await bcrypt.hash(data.password, 10),
    }

    const createdData = new this.userModel(userData);

    await createdData.save();

    const user = await this.userModel.findOne({ email: data.email }).exec();
    if (!user) throw new BadRequestException('Usuário não encontrado')

    return {
      user: { id: user._id, email: user.email, name: user.name },
      token: this.createToken(user)
    };
  }

  async deleteUser(id: any): Promise<UserData | any> {
    const deletedUser = await this.userModel.findByIdAndDelete({ _id: id.id }).exec()
    if (!deletedUser) throw new BadRequestException

    return deletedUser
  }

  updateUser(id: any, data: UserData): UserData | any {
    const updatedUser = this.userModel.findOneAndUpdate(id, data).exec()
    if (!updatedUser) throw new BadRequestException

    return updatedUser
  }

  private async defaultAdmin() {
    const exists = await this.userModel.findOne({ email: 'admin@admin.com' });

    if (!exists) {
      await this.userModel.create({
        email: 'admin@admin.com',
        name: 'Senhor Administrador',
        password: await bcrypt.hash('123456', 10)
      })

      console.log('Admin criado! email: admin@admin.com | senha: 123456')
    }
  }
}
