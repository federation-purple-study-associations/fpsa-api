import { ApiProperty } from '@nestjs/swagger';

export class BalanceDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty({required: false})
    public code: number;

    @ApiProperty()
    public name: string;

    @ApiProperty({required: false})
    public liabilities: number;

    @ApiProperty({required: false})
    public assets: number;

    @ApiProperty()
    public startAssets: number;

    @ApiProperty()
    public startLiabilities: number;
}