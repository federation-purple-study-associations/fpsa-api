import { Injectable } from "@nestjs/common";
import { IncomeStatement } from "../entities/accountancy/income.statement.entity";
import { PaymentMethod } from "../entities/accountancy/payment.method.entity";
import { Mutation } from "../entities/accountancy/mutation.entity";

@Injectable()
export class AccountancyRepository {
    public readAllIncomeStatements(till?: Date, name?: string): Promise<IncomeStatement[]> {
        return IncomeStatement.find({
            join: { alias: 'incomeStatement', leftJoinAndSelect: { mutations: 'incomeStatement.mutations'}},
            where: qb => {
                if (till) {
                    qb.where('mutations.date <= :date', { date: till});
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
                    qb.where('mutations.date <= :date', { date: till});
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

    public saveMutation(mutation: Mutation): Promise<Mutation> {
        return mutation.save();
    }

    public savePaymentMethod(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
        return paymentMethod.save();
    }

    public saveIncomeStatement(incomeStatement: IncomeStatement): Promise<IncomeStatement> {
        return incomeStatement.save();
    }
}