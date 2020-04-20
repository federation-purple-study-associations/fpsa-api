import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewApplication {
    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    public email: string;
}
