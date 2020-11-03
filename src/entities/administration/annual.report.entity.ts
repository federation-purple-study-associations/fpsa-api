import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class AnnualReport extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty({type: String, format: 'date'})
    public delivered: Date;

    @Column()
    public documentUrl: string;

    // Only used by the frontend
    @ApiProperty({required: false})
    public period: string;

    @ManyToOne(() => User, user => user.annualReports)
    @ApiProperty({type: () => User})
    public user: User;
}
