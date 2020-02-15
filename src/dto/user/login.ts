import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
    @ApiProperty({type: String, format: 'email'})
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @ApiProperty({type: String, format: 'password'})
    @IsNotEmpty()
    public password: string;
}