import { ApiProperty } from "@nestjs/swagger";

export class MutationDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public entryReference: number;

    @ApiProperty()
    public description: string;

    @ApiProperty({type: String, format: 'date'})
    public date: Date;

    @ApiProperty()
    public amount: number;

    @ApiProperty()
    public debtorIban: string;

    @ApiProperty()
    public incomeStatementId: number;

    @ApiProperty()
    public balanceId: number;
}

export class MutationResponseDTO {
    @ApiProperty({type: MutationDTO, isArray: true})
    public mutations: MutationDTO[];

    @ApiProperty()
    public total: number;
}
