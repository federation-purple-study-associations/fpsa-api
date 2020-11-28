import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class UserNewDTO {
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
    @IsNotEmpty()
    public roleId: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    @Exclude()
    public photo: any[];
}
