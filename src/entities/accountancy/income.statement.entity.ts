import { BaseEntity, Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Mutation } from './mutation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'accountancy_income_statement'})
export class IncomeStatement extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty()
    public name: string;

    @Column()
    @ApiProperty()
    public code: number;

    @OneToMany(() => Mutation, mutation => mutation.incomeStatement)
    public mutations: Mutation[];
}