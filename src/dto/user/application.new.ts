import { IsNotEmpty, IsEmail, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewApplication {
    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    public email: string;

    @IsNotEmpty()
    @ApiProperty()
    public academy: string;

    @IsNotEmpty()
    @ApiProperty()
    public establishment: string;

    @IsNotEmpty()
    @Max(100000000)
    @Min(0)
    @ApiProperty()
    public kvk: number;
}
