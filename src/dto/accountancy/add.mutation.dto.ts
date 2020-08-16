import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMutationDTO {
    @IsNotEmpty()
    @ApiProperty()
    public description: string;

    @ApiProperty({required: false})
    public entryReference: number;

    @IsNotEmpty()
    @ApiProperty({type: String, format: 'date'})
    public date: Date;

    @IsNotEmpty()
    @ApiProperty()
    public amount: number;

    @IsNotEmpty()
    @ApiProperty()
    public debtorIban: string;

    @IsNotEmpty()
    @ApiProperty()
    public paymentMethodId: number;

    @IsNotEmpty()
    @ApiProperty()
    public incomeStatementId: number;
}
