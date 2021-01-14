import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Matches } from 'class-validator';

export class UserActivateDTO {
    // Min 8 char long, 1 lowercase, 1 uppercase and 1 number
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\d_@.\#\$&+-?!\(\)*\^%]{8,}$/)
    @ApiProperty({type: String, format: 'password'})
    public password: string;

    @IsNotEmpty()
    @IsUUID('4')
    @ApiProperty({type: String, format: 'uuid'})
    public token: string;
}
