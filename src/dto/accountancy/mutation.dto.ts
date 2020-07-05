import { ApiProperty } from "@nestjs/swagger";

export class MutationDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    entryReference: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    debtorIban: string;
}

export class MutationResponseDTO {
    @ApiProperty({type: MutationDTO, isArray: true})
    mutations: MutationDTO[];

    @ApiProperty()
    total: number;
}
