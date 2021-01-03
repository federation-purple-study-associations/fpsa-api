import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateBoardGrant {

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public document: any[];

    @ApiProperty({ required: false })
    public remarks?: string;
}
