import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssetsDTO {
    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsNotEmpty()
    @ApiProperty()
    public value: number;

    @ApiProperty({nullable: true})
    public comments: string;
}
