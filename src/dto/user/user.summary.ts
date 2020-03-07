import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public fullName: string;

    @ApiProperty()
    public email: string;
}