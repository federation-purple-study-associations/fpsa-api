import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public titleEN: string;

    @Column()
    public titleNL: string;

    @Column()
    public textEN: string;

    @Column()
    public textNL: string;

    @Column()
    public photoUrl: string;
}
