import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'gabriel@email.com' })
    email: string;

    @ApiProperty({ example: '123456' })
    password: string;
}
