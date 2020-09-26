import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { AnnualReport } from './annual.report.entity';

@Entity()
export class ActivityPlan extends BaseEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty({type: String, format: 'date'})
    public delivered: Date;

    @Column()
    @ApiProperty({type: String, format: 'date'})
    public start: Date;

    @Column()
    @ApiProperty({type: String, format: 'date'})
    public end: Date;

    @Column()
    public documentUrl: string;

    @ManyToOne(() => User, user => user.activityPlans)
    @ApiProperty({type: () => User})
    public user: User;

    @OneToOne(() => AnnualReport, report => report.activityPlan)
    public annualReport: AnnualReport;
}
