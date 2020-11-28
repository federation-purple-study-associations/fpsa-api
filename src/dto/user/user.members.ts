import { ApiProperty } from '@nestjs/swagger';

export class MemberDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public fullName: string;

    @ApiProperty()
    public websiteUrl: string;

    constructor(id: number, fullName: string, websiteUrl: string) {
        this.id = id;
        this.fullName = fullName;
        this.websiteUrl = websiteUrl;
    }
}
