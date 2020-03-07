import { ApiProperty } from '@nestjs/swagger';

export class UserNewDTO {
    @ApiProperty()
    public fullName: string;

    @ApiProperty()
    public email: string;

    @ApiProperty()
    public roleId: number;
}
