import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateActivityPlan {

    @ApiProperty({type: String, format: 'date'})
    @IsNotEmpty()
    public start: Date;

    @ApiProperty({type: String, format: 'date'})
    @IsNotEmpty()
    public end: Date;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public document?: any[];
}
