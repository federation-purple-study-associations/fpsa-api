import { ApiProperty } from '@nestjs/swagger';

export class AgendaDetailsDTO {
    @ApiProperty()
    public id: number;
    
    @ApiProperty()
    public location: string;

    @ApiProperty({type: String, format: 'date'})
    public date: Date;

    @ApiProperty({maxLength: 63})
    public title: string;

    @ApiProperty({maxLength: 65535})
    public description: string;
}
