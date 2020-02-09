import { ApiProperty } from '@nestjs/swagger';

export class AgendaDetailsDTO {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    location: string;

    @ApiProperty({type: String, format: 'date'})
    date: Date;

    @ApiProperty({maxLength: 63})
    title: string;

    @ApiProperty({maxLength: 65535})
    description: string;
}
