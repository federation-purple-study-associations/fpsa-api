import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'accountancy_assets'})
export class Assets extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({required: false})
    public id: number;

    @Column()
    @ApiProperty()
    public name: string;

    @Column()
    @ApiProperty()
    public value: number;

    @Column({nullable: true})
    @ApiProperty({nullable: true})
    public comments: string;
}
