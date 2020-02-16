import { ApiProperty } from '@nestjs/swagger';

// No checks in this DTO, because the db will do those checks
export class LoginDTO {
    @ApiProperty({type: String, format: 'email'})
    public email: string;

    @ApiProperty({type: String, format: 'password'})
    public password: string;
}