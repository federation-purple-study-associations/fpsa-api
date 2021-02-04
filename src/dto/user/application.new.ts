import { IsNotEmpty, IsEmail, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { FileUpload } from '../file.interface';

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
    @ApiProperty()
    public kvk: number;

    @ApiProperty()
    public websiteUrl: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @Exclude()
    public photo: FileUpload[];
}
