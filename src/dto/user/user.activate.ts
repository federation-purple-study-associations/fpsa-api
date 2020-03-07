import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserActivateDTO {
    @IsNotEmpty()
    @ApiProperty({type: String, format: 'password'})
    public password: string;

    @IsNotEmpty()
    @IsUUID('4')
    @ApiProperty({type: String, format: 'uuid'})
    public token: string;
}