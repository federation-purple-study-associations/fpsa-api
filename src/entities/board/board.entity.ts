import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty()
    public titleEN: string;

    @Column()
    @ApiProperty()
    public titleNL: string;

    @Column({ type: 'mediumtext' })
    @ApiProperty({ maxLength: 65535 })
    public textEN: string;

    @Column({ type: 'mediumtext' })
    @ApiProperty({ maxLength: 65535 })
    public textNL: string;

    @Column()
    public photoUrl: string;
}
