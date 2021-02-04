import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { FileUpload } from '../file.interface';

export class CreateBoardGrant {

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public document: FileUpload[];

    @ApiProperty({ required: false })
    public remarks?: string;
}
