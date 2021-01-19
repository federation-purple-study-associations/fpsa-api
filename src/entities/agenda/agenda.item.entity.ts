import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AgendaItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty()
    public location: string;

    @Column()
    @ApiProperty({ type: String, format: 'date' })
    public date: Date;

    @Column()
    public imageUrl: string;

    @Column({length: 63})
    @ApiProperty({ maxLength: 63 })
    public titleNL: string;

    @Column({length: 63})
    @ApiProperty({ maxLength: 63 })
    public titleEN: string;

    @Column({length: 16382})
    @ApiProperty({ maxLength: 16382 })
    public descriptionNL: string;

    @Column({length: 16382})
    @ApiProperty({ maxLength: 16382 })
    public descriptionEN: string;

    @Column({default: false})
    @ApiProperty()
    public isDraft: boolean;
}
