import { ApiProperty } from "@nestjs/swagger";

export class MutationDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    entryReference: number;

    @ApiProperty()
    description: string;

    @ApiProperty({type: String, format: 'date'})
    date: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    debtorIban: string;

    @ApiProperty()
    incomeStatementId: number;

    @ApiProperty()
    balanceId: number;
}

export class MutationResponseDTO {
    @ApiProperty({type: MutationDTO, isArray: true})
    mutations: MutationDTO[];

    @ApiProperty()
    total: number;
}
