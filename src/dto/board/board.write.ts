import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class WriteBoardDTO {
    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    public titleNL: string;

    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    public titleEN: string;

    @ApiProperty({ maxLength: 65535 })
    @IsNotEmpty()
    @MaxLength(65535)
    public textNL: string;

    @ApiProperty({ maxLength: 65535 })
    @IsNotEmpty()
    @MaxLength(65535)
    public textEN: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public image: any[];

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    public policy: any[];
}
