import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class NewBoardDTO {
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
    textNL: string;

    @ApiProperty({maxLength: 255})
    @IsNotEmpty()
    @MaxLength(255)
    textEN: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @Exclude()
    image: any;
}
