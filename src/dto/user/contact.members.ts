import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { FileUpload } from '../file.interface';

export class ContactMembersDTO {
    @ApiProperty()
    @IsNotEmpty()
    public subject: string;

    @ApiProperty()
    @IsNotEmpty()
    public message: string;

    @ApiProperty({type: 'string', format: 'binary', required: false})
    @Exclude()
    public attachments: FileUpload[];
}
