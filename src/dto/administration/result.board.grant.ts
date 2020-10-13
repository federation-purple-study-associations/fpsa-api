import { ApiProperty } from '@nestjs/swagger';
import { BoardGrant } from '../../entities/administration/board.grant.entity';

export class ResultBoardGrant {
    @ApiProperty()
    public count: number;

    @ApiProperty({type: () => BoardGrant, isArray: true})
    public boardGrants: BoardGrant[];
}
