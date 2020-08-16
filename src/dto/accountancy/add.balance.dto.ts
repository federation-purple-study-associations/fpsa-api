import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddBalanceDTO {
    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsNotEmpty()
    @ApiProperty()
    public code: number;

    @IsNotEmpty()
    @ApiProperty()
    public startAssets: number;

    @IsNotEmpty()
    @ApiProperty()
    public startLiabilities: number;
}