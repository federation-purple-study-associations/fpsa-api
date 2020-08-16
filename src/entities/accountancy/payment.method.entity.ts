import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Mutation } from './mutation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'accountancy_payment_method'})
export class PaymentMethod extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    public id: number;

    @Column()
    @ApiProperty()
    public name: string;

    @Column()
    @ApiProperty()
    public code: number;

    @Column({ default: 0 })
    @ApiProperty({ default: 0 })
    public startAssets: number;

    @Column({ default: 0 })
    @ApiProperty({ default: 0 })
    public startLiabilities: number;

    @OneToMany(() => Mutation, mutation => mutation.paymentMethod)
    public mutations: Mutation[];
}