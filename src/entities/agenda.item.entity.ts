import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AgendaItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    location: string;

    @Column()
    @ApiProperty({type: String, format: 'date'})
    date: Date;

    @Column()
    @ApiProperty()
    titleNL: string;

    @Column()
    @ApiProperty()
    titleEN: string;

    @Column()
    @ApiProperty()
    desciptionNL: string;

    @Column()
    @ApiProperty()
    desciptionEN: string;
}
