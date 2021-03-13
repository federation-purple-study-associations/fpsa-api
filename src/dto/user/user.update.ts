import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, Max, Min } from 'class-validator';
import { FileUpload } from '../file.interface';

export class UserUpdateDTO {
    @ApiProperty()
    @IsNotEmpty()
    public fullName: string;

    @ApiProperty()
    @IsNotEmpty()
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

    @ApiProperty()
    public boardTransfer: string;

    @ApiProperty()
    public isSleeping: boolean;

    @ApiProperty()
    @IsNotEmpty()
    public roleId: number;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public photo: FileUpload[];
}
