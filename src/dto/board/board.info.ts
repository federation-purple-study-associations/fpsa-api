import { ApiProperty } from '@nestjs/swagger';

export class BoardInfoDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public title: string;

    @ApiProperty()
    public text: string;

    @ApiProperty()
    public hasPolicyPlan: boolean;
}
