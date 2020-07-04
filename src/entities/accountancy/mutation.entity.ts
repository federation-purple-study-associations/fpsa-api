import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { PaymentMethod } from './payment.method.entity';
import { IncomeStatement } from './income.statement.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'accountancy_mutation'})
export class Mutation extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    entryReference: number;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @Column()
    date: Date;

    @ApiProperty()
    @Column()
    amount: number;

    @ApiProperty()
    @Column()
    debtorIban: string;

    @ApiProperty({ default: false })
    @Column({ default: false })
    imported: boolean;

    @ApiProperty({ type: PaymentMethod, required: false })
    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.mutations,  { onDelete: 'CASCADE', nullable: true })
    paymentMethod?: PaymentMethod;

    @ApiProperty({ type: IncomeStatement, required: false })
    @ManyToOne(() => IncomeStatement, incomeStatement => incomeStatement.mutations,  { onDelete: 'CASCADE', nullable: true })
    incomeStatement?: IncomeStatement;
}