import { Injectable } from '@nestjs/common';
import { UserData, UserDataDocument } from '../../schema/userData.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserData.name) private userModel: Model<UserDataDocument>) { }

  getUsers(): Promise<UserData | any> {
    let userData: Promise<UserData | any>;

    //if (data.email) return this.userModel.findOne({ email: data.email }).exec();

    userData = this.userModel.find().exec();
    return userData;
  }

  async createUser(data: UserData): Promise<UserData[] | any> {
    const usersData = await this.userModel.findOne({ email: data.email }).exec();

    if (usersData) {
      throw new Error('Email already registered');
    }

    const userData = {
      email: data.email,
      name: data.name,
      password: await bcrypt.hash(data.password, 10),
    }

    const createdData = new this.userModel(userData);

    await createdData.save();

    return this.userModel.findOne({ email: data.email }).select('_id email name').exec();
  }
}
