import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Scope extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public scope: string;

    @ManyToMany(() => Role, role => role.scopes)
    public roles: Role[];
}
