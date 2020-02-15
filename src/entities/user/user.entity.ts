import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Scope } from './scope.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;

    @Column({ select: false })
    public password: string;

    @Column()
    public fullName: string;

    @ManyToMany(() => Scope, scope => scope.users)
    @JoinTable()
    public scopes: Scope[];
}