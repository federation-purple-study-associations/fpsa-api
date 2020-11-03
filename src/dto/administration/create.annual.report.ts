import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateAnnualReport {
    
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public document?: any[];
}
