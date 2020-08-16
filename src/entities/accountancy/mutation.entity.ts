import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { PaymentMethod } from './payment.method.entity';
import { IncomeStatement } from './income.statement.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'accountancy_mutation'})
export class Mutation extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    public id: number;

    @ApiProperty()
    @Column()
    public entryReference: number;

    @ApiProperty()
    @Column()
    public description: string;

    @ApiProperty()
    @Column()
    public date: Date;

    @ApiProperty()
    @Column()
    public amount: number;

    @ApiProperty()
    @Column()
    public debtorIban: string;

    @ApiProperty({ default: false })
    @Column({ default: false })
    public imported: boolean;

    @Column({ nullable: false })
    public paymentMethodId: number;

    @ApiProperty({ type: PaymentMethod, required: false })
    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.mutations,  { onDelete: 'CASCADE', nullable: true })
    public paymentMethod?: PaymentMethod;

    @Column({ nullable: false })
    public incomeStatementId: number;

    @ApiProperty({ type: IncomeStatement, required: false })
    @ManyToOne(() => IncomeStatement, incomeStatement => incomeStatement.mutations,  { onDelete: 'CASCADE', nullable: true })
    public incomeStatement?: IncomeStatement;
}
