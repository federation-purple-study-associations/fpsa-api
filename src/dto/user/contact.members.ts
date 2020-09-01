import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ContactMembersDTO {
    @ApiProperty()
    @IsNotEmpty()
    public subject: string;

    @ApiProperty()
    @IsNotEmpty()
    public message: string;
}
