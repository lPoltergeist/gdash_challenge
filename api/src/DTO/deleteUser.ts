import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
    name: string;
    email: string;
}
