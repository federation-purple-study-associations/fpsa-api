import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserNewDTO {
    @ApiProperty()
    @IsNotEmpty()
    public fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
    public roleId: number;
}
