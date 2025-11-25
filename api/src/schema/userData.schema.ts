import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDataDocument = UserData & Document;

@Schema({ timestamps: true })
export class UserData {
    @Prop() email: string
    @Prop() name: string
    @Prop() password: string
}

export const UserDataSchema = SchemaFactory.createForClass(UserData);
