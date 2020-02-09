import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AgendaItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location: string;

    @Column()
    date: Date;

    @Column()
    @ApiProperty()
    imageUrl: string;

    @Column({length: 63})
    titleNL: string;

    @Column({length: 63})
    titleEN: string;

    @Column({length: 255})
    summaryNL: string;

    @Column({length: 255})
    summaryEN: string;

    @Column({length: 65535})
    desciptionNL: string;

    @Column({length: 65535})
    desciptionEN: string;
}
