import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty()
    public email: string;

    @Column({ select: false })
    public password: string;

    @Column()
    @ApiProperty()
    public fullName: string;

    @Column({nullable: true})
    @ApiProperty({type: String, format: 'date', required: false})
    public lastLogin: Date;

    @ManyToOne(() => Role, role => role.users)
    public role: Role;
}
