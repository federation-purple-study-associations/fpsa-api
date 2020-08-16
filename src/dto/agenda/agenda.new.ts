import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class NewAgendaDTO {
    @ApiProperty()
    @IsNotEmpty()
    public location: string;

    @ApiProperty({type: String, format: 'date'})
    @IsNotEmpty()
    public date: Date;

    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    public titleNL: string;

    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    public titleEN: string;

    @ApiProperty({maxLength: 255})
    @IsNotEmpty()
    @MaxLength(255)
    public summaryNL: string;

    @ApiProperty({maxLength: 255})
    @IsNotEmpty()
    @MaxLength(255)
    public summaryEN: string;

    @ApiProperty({maxLength: 65535})
    @IsNotEmpty()
    @MaxLength(65535)
    public descriptionNL: string;

    @ApiProperty({maxLength: 65535})
    @IsNotEmpty()
    @MaxLength(65535)
    public descriptionEN: string;

    @ApiProperty()
    @IsNotEmpty()
    public isDraft: 'true' | 'false';

    @ApiProperty({ type: 'string', format: 'binary' })
    @Exclude()
    public image: any;
}