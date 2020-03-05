import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, Column } from 'typeorm';
import { User } from './user.entity';
import { Scope } from './scope.entity';

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany(() => User, user => user.role)
    public users: User[];

    @ManyToMany(() => Scope, scope => scope.roles)
    @JoinTable()
    public scopes: Scope[];
}
