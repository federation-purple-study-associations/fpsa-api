import { ApiProperty } from '@nestjs/swagger';

export class AgendaSummaryDTO {
    @ApiProperty()
    public id: number;
    
    @ApiProperty()
    public location: string;

    @ApiProperty({type: String, format: 'date'})
    public date: Date;

    @ApiProperty({maxLength: 63})
    public title: string;

    @ApiProperty({maxLength: 255})
    public summary: string;
}
