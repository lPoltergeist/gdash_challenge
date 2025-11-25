import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserDataSchema } from "src/schema/userData.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'UserData', schema: UserDataSchema, collection: 'users' },
        ])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, MongooseModule],
})

export class UserModule { }