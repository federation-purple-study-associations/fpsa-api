import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Scope extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public scope: string;

    @ManyToMany(() => User, user => user.scopes)
    public users: User[];
}