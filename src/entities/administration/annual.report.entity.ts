import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityPlan } from './activity.plan.entity';

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

    @OneToOne(() => ActivityPlan, plan => plan.annualReport)
    @JoinColumn()
    public activityPlan: ActivityPlan;
}
