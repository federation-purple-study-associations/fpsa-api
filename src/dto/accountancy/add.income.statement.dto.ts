import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddIncomeStatementDTO {
    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsNotEmpty()
    @ApiProperty()
    public code: number;
}
