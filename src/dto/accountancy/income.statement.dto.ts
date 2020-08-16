import { ApiProperty } from '@nestjs/swagger';

export class IncomeStatementDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public name: string;

    @ApiProperty({nullable: true, required: false})
    public code: number;

    @ApiProperty({nullable: true, required: false})
    public profit: number;

    @ApiProperty({nullable: true, required: false})
    public lost: number;
}
