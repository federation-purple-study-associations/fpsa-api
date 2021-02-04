import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { FileUpload } from '../file.interface';

export class CreateAnnualReport {
    
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public document?: FileUpload[];
}
