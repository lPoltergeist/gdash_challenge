import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserData, UserDataDocument } from '../../schema/userData.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BlacklistData, BlacklistDataDocument } from 'src/schema/blacklist.schema';
import { randomUUID } from 'crypto';
import { LoginDto } from 'src/DTO/login';

@Injectable()
export class AuthService {
    constructor(@InjectModel(UserData.name) private userModel: Model<UserDataDocument>,
        @InjectModel(BlacklistData.name) private blacklistModel: Model<BlacklistDataDocument>,
        private jwtService: JwtService) { }

    private createToken(user: UserData): string {
        const payload = { email: user.email, name: user.name, uuid: randomUUID() };
        return this.jwtService.sign(payload);
    }

    async validadePassword(email: string, password: string): Promise<boolean> {
        const userExists = await this.userModel.findOne({ email: email }).exec();
        if (!userExists) return false

        const passwordMatches = await bcrypt.compare(password, userExists.password);
        if (!passwordMatches) return false;

        return true;
    }

    async login(data: LoginDto): Promise<UserData | any> {
        const user = await this.userModel.findOne({ email: data.email }).exec();
        if (!user) throw new UnauthorizedException('Usuário não encontrado.')

        const passwordValid = await this.validadePassword(data.email, data.password);
        if (!passwordValid) throw new UnauthorizedException('Credeciais inválidas.')

        return {
            user: { id: user._id, email: user.email, name: user.name },
            token: this.createToken(user)
        };
    }

    async logout(token: string) {
        const { uuid } = this.jwtService.decode(token)

        if (!uuid) throw new BadRequestException

        const uuidBlacklisted = new this.blacklistModel({ uuid: uuid })

        await uuidBlacklisted.save()

        return { message: 'Usuário deslogado!' }

    }

    async isAuthenticated(token: string) {
        const { uuid } = this.jwtService.decode(token)

        if (!uuid) throw new BadRequestException

        const isBlacklisted = await this.blacklistModel.findOne({ uuid: uuid })

        if (isBlacklisted) throw new UnauthorizedException

        return { authenticated: true }
    }
}
