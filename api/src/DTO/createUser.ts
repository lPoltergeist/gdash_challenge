import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'gabriel' })
    name: string;

    @ApiProperty({ example: 'gabriel@email.com' })
    email: string;

    @ApiProperty({ example: '123456' })
    password: string;
}
