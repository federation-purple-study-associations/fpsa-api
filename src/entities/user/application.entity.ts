import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty()
    public name: string;

    @Column()
    @ApiProperty()
    public email: string;

    @Column()
    @ApiProperty()
    public academy: string;

    @Column()
    @ApiProperty()
    public establishment: string;

    @Column()
    @ApiProperty()
    public kvk: number;

    @Column()
    @ApiProperty({type: String, format: 'date', required: false})
    public handedIn: Date;

    @Column()
    @ApiProperty()
    public websiteUrl: string;

    @Column()
    public photoUrl: string;
}
