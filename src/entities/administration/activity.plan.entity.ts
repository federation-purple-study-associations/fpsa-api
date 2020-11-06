import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

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

    @Column({ nullable: true })
    @ApiProperty({type: String, format: 'date'})
    public sendToCommission: Date;

    @Column()
    public documentUrl: string;

    @ManyToOne(() => User, user => user.activityPlans)
    @ApiProperty({type: () => User})
    public user: User;
}
