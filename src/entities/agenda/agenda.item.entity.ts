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
    @ApiProperty({ type: String, format: 'date' })
    date: Date;

    @Column()
    imageUrl: string;

    @Column({length: 63})
    @ApiProperty({ maxLength: 63 })
    titleNL: string;

    @Column({length: 63})
    @ApiProperty({ maxLength: 63 })
    titleEN: string;

    @Column({length: 255})
    @ApiProperty({ maxLength: 255 })
    summaryNL: string;

    @Column({length: 255})
    @ApiProperty({ maxLength: 255 })
    summaryEN: string;

    @Column({type: 'mediumtext'})
    @ApiProperty({ maxLength: 65535 })
    descriptionNL: string;

    @Column({type: 'mediumtext'})
    @ApiProperty({ maxLength: 65535 })
    descriptionEN: string;

    @Column({default: false})
    @ApiProperty()
    isDraft: boolean;
}
