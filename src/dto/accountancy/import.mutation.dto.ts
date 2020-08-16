import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ImportMutationDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    public paymentMethodId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    public incomeStatementId: number;
}