import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactFormDTO {
    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
    public subject: string;

    @ApiProperty()
    @IsNotEmpty()
    public message: string;
}