import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserForgotDTO {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    public email: string;
}
