import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Scope } from './scope.entity';
import { ApiProperty } from '@nestjs/swagger';

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

    @ManyToMany(() => Scope, scope => scope.users)
    @JoinTable()
    public scopes: Scope[];
}