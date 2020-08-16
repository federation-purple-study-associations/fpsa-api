import { Injectable } from "@nestjs/common";
import { IncomeStatement } from "../entities/accountancy/income.statement.entity";
import { PaymentMethod } from "../entities/accountancy/payment.method.entity";
import { Mutation } from "../entities/accountancy/mutation.entity";
import { BaseEntity } from 'typeorm';

@Injectable()
export class AccountancyRepository {
    public readAllMutations(skip: number, take: number, from?: Date, till?: Date, paymentMethod?: number, incomeStatement?: number): Promise<Mutation[]> {
        return Mutation.find({
            skip,
            take,
            join: { alias: 'mutation', leftJoinAndSelect: { payment: 'mutation.paymentMethod', incomeStatement: 'mutation.incomeStatement' } },
            where: qb => {
                qb.where('mutation.imported = 1');

                if (till) {
                    qb.andWhere('mutation.date < :till', { till });
                }

                if (from) {
                    qb.andWhere('mutation.date > :from', { from });
                }

                if (paymentMethod) {
                    qb.andWhere('payment.id = :paymentMethod', { paymentMethod });
                }

                if (incomeStatement) {
                    qb.andWhere('incomeStatement.id = :incomeStatement', { incomeStatement });
                }
            },
            order: {id: 'DESC'},
        });
    }

    public countMutations(from?: Date, till?: Date, paymentMethod?: number, incomeStatement?: number): Promise<number> {
        return Mutation.count({
            join: { alias: 'mutation', leftJoinAndSelect: { payment: 'mutation.paymentMethod', incomeStatement: 'mutation.incomeStatement' } },
            where: qb => {
                qb.where('mutation.imported = 1');

                if (till) {
                    qb.andWhere('mutation.date < :till', { till });
                }

                if (from) {
                    qb.andWhere('mutation.date > :from', { from });
                }

                if (paymentMethod) {
                    qb.andWhere('payment.id = :paymentMethod', { paymentMethod });
                }

                if (incomeStatement) {
                    qb.andWhere('incomeStatement.id = :incomeStatement', { incomeStatement });
                }
            },
        });
    }

    public readAllIncomeStatements(till?: Date, name?: string): Promise<IncomeStatement[]> {
        return IncomeStatement.find({
            join: { alias: 'incomeStatement', leftJoinAndSelect: { mutations: 'incomeStatement.mutations' }},
            where: qb => {
                if (till) {
                    qb.where('mutations.date <= :date', { date: till });
                }

                if (name) {
                    qb.where('incomeStatement.name LIKE :name', { name: `%${name}%` } );
                }
            },
        });
    }

    public readAllPaymentMethods(till?: Date, name?: string): Promise<PaymentMethod[]> {
        return PaymentMethod.find({
            join: { alias: 'paymentMethod', leftJoinAndSelect: { mutations: 'paymentMethod.mutations'}},
            where: qb => {
                if (till) {
                    qb.where('mutations.date <= :date', { date: till });
                }

                if (name) {
                    qb.where('paymentMethod.name LIKE :name', { name: `%${name}%` } );
                }
            },
        });
    }

    public readAllNotImportedMutations(): Promise<Mutation[]> {
        return Mutation.find({ where: { imported: false }});
    }

    public readOneMutations(id: number): Promise<Mutation> {
        return Mutation.findOne({ where: { id }, relations: ['paymentMethod', 'incomeStatement']});
    }

    public readOnePaymentMethod(id: number): Promise<PaymentMethod> {
        return PaymentMethod.findOne( {where: { id }});
    }

    public readOnePaymentMethodByCode(code: number): Promise<PaymentMethod> {
        return PaymentMethod.findOne( {where: { code }});
    }

    public deletePaymentMethod(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
        return PaymentMethod.remove(paymentMethod);
    }

    public readOneIncomeStatement(id: number): Promise<IncomeStatement> {
        return IncomeStatement.findOne( {where: { id }});
    }

    public readOneIncomeStatementByCode(code: number): Promise<IncomeStatement> {
        return IncomeStatement.findOne( {where: { code }});
    }

    public deleteIncomeStatement(incomeStatement: IncomeStatement): Promise<IncomeStatement> {
        return IncomeStatement.remove(incomeStatement);
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }
}
