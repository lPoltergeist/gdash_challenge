import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'Zézinho' })
    name: string;

    @ApiProperty({ example: 'Zézinho@email.com' })
    email: string;

    @ApiProperty({ example: '123456' })
    password: string;
}
