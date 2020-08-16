import { IncomeStatement } from "../entities/accountancy/income.statement.entity";
import { IncomeStatementDTO } from "../dto/accountancy/income.statement.dto";
import { Mutation } from "../entities/accountancy/mutation.entity";
import { PaymentMethod } from "../entities/accountancy/payment.method.entity";
import { BalanceDTO } from "../dto/accountancy/balance.dto";
import { NotImportedMutationDTO } from "../dto/accountancy/not.imported.mutation.dto";
import { MutationDTO, MutationResponseDTO } from "src/dto/accountancy/mutation.dto";
import { AddMutationDTO } from '../dto/accountancy/add.mutation.dto';

export class AccountancyTransformer {
    public static incomeStatment(array: IncomeStatement[]): IncomeStatementDTO[] {
        const response: IncomeStatementDTO[] = [];

        for (const incomeStatement of array) {
            const sum = incomeStatement.mutations.reduce((a, b) => a + (b.amount || 0), 0);

            const dto: IncomeStatementDTO = {
                id: incomeStatement.id,
                code: incomeStatement.code,
                name: incomeStatement.name,
                profit: sum >= 0 ? sum : null,
                lost: sum < 0 ? sum * -1 : null,
            };

            response.push(dto);
        }

        return response;
    }

    public static balance(array: PaymentMethod[]): BalanceDTO[] {
        const response: BalanceDTO[] = [];

        for (const paymentMethod of array) {
            const sum = paymentMethod.mutations.reduce((a, b) => a + (b.amount || 0), 0);
            const total = sum + paymentMethod.startAssets - paymentMethod.startLiabilities;

            const dto: BalanceDTO = {
                id: paymentMethod.id,
                code: paymentMethod.code,
                name: paymentMethod.name,
                assets: total >= 0 ? total : null,
                liabilities: total < 0 ? total : null,
                startAssets: paymentMethod.startAssets,
                startLiabilities: paymentMethod.startLiabilities,
            };

            response.push(dto);
        }

        return response;
    }

    public static mutation(array: Mutation[], count: number): MutationResponseDTO {
        const response: MutationDTO[] = [];

        for (const mutation of array) {
            const dto: MutationDTO = {
                id: mutation.id,
                description: mutation.description,
                debtorIban: mutation.debtorIban,
                amount: mutation.amount,
                date: mutation.date,
                entryReference: mutation.entryReference,
                balanceId: mutation.paymentMethodId,
                incomeStatementId: mutation.incomeStatementId,
            };

            response.push(dto);
        }
        return {
            total: count,
            mutations: response,
        };
    }

    public static updateMutation(mutation: Mutation, update: AddMutationDTO): Mutation {
        mutation.description = update.description;
        mutation.debtorIban = update.debtorIban;
        mutation.amount = update.amount;
        mutation.date = update.date;
        mutation.incomeStatementId = update.incomeStatementId;
        mutation.paymentMethodId = update.paymentMethodId;

        return mutation;
    }

    public static mutationNotImported(array: Mutation[]): NotImportedMutationDTO[] {
        const response: NotImportedMutationDTO[] = [];

        for (const mutation of array) {
            const dto: NotImportedMutationDTO = {
                id: mutation.id,
                description: mutation.description,
                debtorIban: mutation.debtorIban,
                amount: mutation.amount,
                date: mutation.date,
            };

            response.push(dto);
        }
        return response;
    }
}
