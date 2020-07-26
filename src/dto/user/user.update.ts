import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

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
    @Max(100000000)
    @Min(0)
    @ApiProperty()
    public kvk: number;

    @ApiProperty()
    @IsNotEmpty()
    public roleId: number;

    @ApiProperty({type: String, format: 'date'})
    public memberSince: Date;
}
