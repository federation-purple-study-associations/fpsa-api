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

    // Only used by the frontend
    @ApiProperty({required: false})
    public period: string;

    @OneToOne(() => ActivityPlan, plan => plan.annualReport, { nullable: true })
    @JoinColumn()
    @ApiProperty({type: () => ActivityPlan, required: false})
    public activityPlan: ActivityPlan;
}
