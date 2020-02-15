import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateAgendaDTO {
    @ApiProperty()
    @IsNotEmpty()
    location: string;

    @ApiProperty({type: String, format: 'date'})
    @IsNotEmpty()
    date: Date;

    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    titleNL: string;

    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    titleEN: string;

    @ApiProperty({maxLength: 255})
    @IsNotEmpty()
    @MaxLength(255)
    summaryNL: string;

    @ApiProperty({maxLength: 255})
    @IsNotEmpty()
    @MaxLength(255)
    summaryEN: string;

    @ApiProperty({maxLength: 65535})
    @IsNotEmpty()
    @MaxLength(65535)
    descriptionNL: string;

    @ApiProperty({maxLength: 65535})
    @IsNotEmpty()
    @MaxLength(65535)
    descriptionEN: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @Exclude()
    image: any;
}