import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Nationality } from '../../entities/user/nationality.enum';
import { FileUpload } from '../file.interface';

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

    @ApiProperty({required: false})
    public boardTransfer: string;

    @ApiProperty({enum: Nationality})
    public nationality: Nationality;

    @ApiProperty()
    @IsNotEmpty()
    public roleId: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    @Exclude()
    public photo: FileUpload[];
}
