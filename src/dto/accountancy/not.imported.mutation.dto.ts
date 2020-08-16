import { ApiProperty } from '@nestjs/swagger';

export class NotImportedMutationDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public description: string;

    @ApiProperty({type: String, format: 'date'})
    public date: Date;

    @ApiProperty()
    public amount: number;

    @ApiProperty()
    public debtorIban: string;
}
