import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty, ApiOperation } from '@nestjs/swagger';
import { Role } from './role.entity';
import { Confirmation } from './confirmation.entity';

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
}
