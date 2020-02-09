import { ApiProperty } from '@nestjs/swagger';

export class AgendaSummaryDTO {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    location: string;

    @ApiProperty({type: String, format: 'date'})
    date: Date;

    @ApiProperty({maxLength: 63})
    title: string;

    @ApiProperty({maxLength: 255})
    summary: string;
}
