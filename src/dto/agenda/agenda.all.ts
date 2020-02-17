import { AgendaSummaryDTO } from './agenda.summary';
import { ApiProperty } from '@nestjs/swagger';

export class AgendaAllDTO {
    @ApiProperty({type: AgendaSummaryDTO, isArray: true})
    public items: AgendaSummaryDTO[];

    @ApiProperty()
    public count: number;
}
