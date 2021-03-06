import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';
import { Confirmation } from './confirmation.entity';
import { ActivityPlan } from '../administration/activity.plan.entity';
import { AnnualReport } from '../administration/annual.report.entity';
import { Nationality } from './nationality.enum';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty()
    public email: string;

    @Column({ select: false, nullable: true })
    public password: string;

    @Column()
    @ApiProperty()
    public fullName: string;

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
    @ApiProperty()
    public boardTransfer: string;

    @Column()
    @ApiProperty()
    public websiteUrl: string;

    @Column()
    @ApiProperty()
    public isSleeping: boolean;

    @Column()
    public photoUrl: string;

    @Column({default: Nationality.DUTCH})
    @ApiProperty({enum: Nationality})
    public nationality: Nationality;

    @Column({nullable: true})
    @ApiProperty({type: String, format: 'date', required: false})
    public lastLogin: Date;

    @Column({nullable: true})
    @ApiProperty({type: String, format: 'date', required: false})
    public memberSince: Date;

    @Column({default: false})
    @ApiProperty()
    public recieveEmailUpdatesEvents: boolean;

    @Column({ nullable: true })
    @ApiProperty()
    public roleId: number;

    @ManyToOne(() => Role, role => role.users)
    public role: Role;

    @OneToMany(() => Confirmation, conf => conf.user)
    public confirmations: Confirmation[];

    @OneToMany(() => ActivityPlan, plan => plan.user)
    public activityPlans: ActivityPlan[];

    @OneToMany(() => AnnualReport, plan => plan.user)
    public annualReports: AnnualReport[];
}
