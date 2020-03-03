import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class WriteBoardDTO {
    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    titleNL: string;

    @ApiProperty({maxLength: 63})
    @IsNotEmpty()
    @MaxLength(63)
    titleEN: string;

    @ApiProperty({ maxLength: 65535 })
    @IsNotEmpty()
    @MaxLength(65535)
    textNL: string;

    @ApiProperty({ maxLength: 65535 })
    @IsNotEmpty()
    @MaxLength(65535)
    textEN: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @Exclude()
    image: any[];
}
