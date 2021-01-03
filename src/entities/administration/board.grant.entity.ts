import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class BoardGrant extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty({type: String, format: 'date'})
    public delivered: Date;

    @Column({default: false})
    @ApiProperty()
    public checked: boolean;

    @Column({nullable: true})
    @ApiProperty({type: String, format: 'date'})
    public checkedAt: Date;

    @Column({nullable: true})
    @ApiProperty({required: false})
    public remarks?: string;

    @Column()
    public documentUrl: string;

    @ManyToOne(() => User, user => user.activityPlans)
    @ApiProperty({type: () => User})
    public user: User;
}
