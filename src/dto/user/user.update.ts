import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDTO {
    @ApiProperty()
    public fullName: string;

    @ApiProperty()
    public email: string;

    @ApiProperty()
    public roleId: number;
}
