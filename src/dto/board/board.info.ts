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

export class BoardInfoTotalDTO {
    @ApiProperty({type: BoardInfoDTO, isArray: true})
    public boards: BoardInfoDTO[];

    @ApiProperty()
    public total: number;
}
