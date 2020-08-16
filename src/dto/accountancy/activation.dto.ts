import { ApiProperty } from '@nestjs/swagger';

export class ActivationLinkDTO {
    @ApiProperty()
    public href: string;
}