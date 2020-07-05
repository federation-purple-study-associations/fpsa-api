import { Controller, Post, HttpCode, Body, GoneException, InternalServerErrorException, Get, Query, ConflictException, Put, Param, NotFoundException, Delete, BadRequestException, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { SaveAuthorizationDTO } from "../../dto/accountancy/saveAuthorization.dto";
import axios from 'axios';
import { AccessResponse } from "../../dto/accountancy/accessResponse.dto";
import { FileService } from "../../services/file/file.service";
import { AccountancyService } from "../../services/accountancy/accountancy.service";
import { Auth } from "../../decorators/auth.decorator";
import { IncomeStatement } from "../../entities/accountancy/income.statement.entity";
import { Mutation } from "../../entities/accountancy/mutation.entity";
import { PaymentMethod } from "../../entities/accountancy/payment.method.entity";
import { ActivationLinkDTO } from "../../dto/accountancy/activation.dto";
import { AccountancyRepository } from "../../repositories/accountancy.repository";
import { IncomeStatementDTO } from "../../dto/accountancy/income.statement.dto";
import { AddIncomeStatementDTO } from "../../dto/accountancy/add.income.statement.dto";
import { BalanceDTO } from "../../dto/accountancy/balance.dto";
import { AddBalanceDTO } from "../../dto/accountancy/add.balance.dto";
import { AddMutationDTO } from "../../dto/accountancy/add.mutation.dto";
import { NotImportedMutationDTO } from "../../dto/accountancy/not.imported.mutation.dto";
import { ImportMutationDTO } from "../../dto/accountancy/import.mutation.dto";
import { AccountancyTransformer } from "../../transformers/accountancy.transformer";
import { AccountancyInterceptor } from "../../interceptor/accountancy.interceptor";

@Controller('accountancy')
@ApiTags('accountancy')
@UseInterceptors(AccountancyInterceptor)
export class AccountancyController {

    constructor(
        private readonly fileService: FileService,
        private readonly accountancyService: AccountancyService,
        private readonly accountancyRepository: AccountancyRepository,
    ) {}

    @Post('activate')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'ActivateApi',
        summary: 'Activates the Accountancy api',
        description: 'Activates the accountancy api using a Authorization code from the rabo api',
    })
    @ApiResponse({ status: 200, description: 'The Accountancy api is activated!' })
    @ApiResponse({ status: 400, description: 'Validation error...'})
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 410, description: 'Authorization code already used...'})
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async activateAccountancy(@Body() body: SaveAuthorizationDTO): Promise<void> {
        // Redeem Authorization code and saves the access & refresh token
        try {
            const response: AccessResponse = (await axios.post(process.env.RABOBANK_URL + '/oauth2/token',
                                                'grant_type=authorization_code&code=' + body.code,
                                                { headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Authorization': 'Basic ' + Buffer.from(process.env.RABOBANK_CLIENT_ID + ':' + process.env.RABOBANK_CLIENT_SECRET).toString('base64'),
                                                }},
                                    )).data;

            this.fileService.saveAccessTokenAccountancy(response.access_token);
            this.fileService.saveRefreshTokenAccountancy(response.refresh_token);
        } catch (e) {
            throw new GoneException('Authorization code already used or invalid...');
        }

        // Get the account_id and saves it
        try {
            const response: AccountsResponse = (await axios.get(process.env.RABOBANK_URL + '/payments/account-information/ais/v3/accounts',
                                                    { headers: this.accountancyService.getHttpsHeader(
                                                                    this.fileService.getAccessTokenAccountancy(),
                                                                    this.fileService.getCertificate(),
                                                                    this.fileService.getPrivateKey(),
                                                                    process.env.RABOBANK_CLIENT_ID,
                                                                    +process.env.RABOBANK_CERTIFICATE_KEY_ID
                                                                ),
                                                    httpsAgent: this.accountancyService.getAccountancyHttpAgent(),
                                                },
                                        )).data;

            this.fileService.saveResourceIdAccountancy(response.accounts[0].resourceId);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    @Post('refresh')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'Refresh',
        summary: 'Refreshes the accountancy',
        description: 'Refreshes the accountancy. This call is for the cronjob or to force an refresh',
    })
    @ApiResponse({ status: 200, description: 'The Accountancy api is activated!' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    refreshMutations(): Promise<void> {
        return this.accountancyService.updateMutations();
    }

    @Get('activate')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'GetActivationLink',
        summary: 'Get the activation link from the rabobank api',
        description: '',
    })
    @ApiResponse({ status: 200, description: 'Rabobank activation link', type: ActivationLinkDTO })
    getRaboActivationLink(): ActivationLinkDTO {
        return {
            href: `${process.env.RABOBANK_URL}/oauth2/authorize?response_type=code&scope=ais.transactions.read-90days&client_id=${process.env.RABOBANK_CLIENT_ID}`,
        };
    }

    @Get('incomeStatement')
    @HttpCode(200)
    @Auth('Accountancy:Read')
    @ApiOperation({
        operationId: 'GetIncomeStatements',
        summary: 'Gets the income statements',
        description: '',
    })
    @ApiQuery({name: 'till', type: String, required: false}) // format: date
    @ApiQuery({name: 'name', type: String, required: false})
    @ApiResponse({ status: 200, description: 'Income statements', type: IncomeStatementDTO, isArray: true })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async getIncomeStatements(@Query('till') till?: string, @Query('name') name?: string): Promise<IncomeStatementDTO[]> {
        return AccountancyTransformer.incomeStatment(await this.accountancyRepository.readAllIncomeStatements(till ? new Date(till) : null, name));
    }

    @Post('/incomeStatement')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'AddIncomeStatement',
        summary: 'Adds an income statement',
        description: '',
    })
    @ApiResponse({ status: 200, description: 'Balance is added!', type: IncomeStatement })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 409, description: 'This income statement code already exists...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async addIncomeStatement(@Body() body: AddIncomeStatementDTO): Promise<IncomeStatement> {
        if (await this.accountancyRepository.readOneIncomeStatementByCode(body.code)) {
            throw new ConflictException('This income statement code already exists...');
        }

        const incomeStatement = new IncomeStatement();
        incomeStatement.name = body.name;
        incomeStatement.code = body.code;
        incomeStatement.mutations = [];

        return this.accountancyRepository.saveIncomeStatement(incomeStatement);
    }

    @Put('/incomeStatement/:id')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'EditIncomeStatement',
        summary: 'Edits an income statement',
        description: '',
    })
    @ApiParam({name: 'id', type: Number, required: true})
    @ApiResponse({ status: 200, description: 'Balance is added!', type: IncomeStatement })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 404, description: 'This income statement could not be found...' })
    @ApiResponse({ status: 409, description: 'This income statement code already exists...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async editIncomeStatement(@Body() body: AddIncomeStatementDTO, @Param('id') id: number): Promise<IncomeStatement> {
        const incomeStatement = await this.accountancyRepository.readOneIncomeStatement(id);
        if (!incomeStatement) {
            throw new NotFoundException('This balance could not be found...');
        }

        const sharedCodeIncomeStatement = await this.accountancyRepository.readOneIncomeStatementByCode(body.code);
        if (sharedCodeIncomeStatement && incomeStatement.id !== sharedCodeIncomeStatement.id) {
            throw new ConflictException('This income statement code already exists...');
        }

        incomeStatement.name = body.name;
        incomeStatement.code = body.code;

        return this.accountancyRepository.saveIncomeStatement(incomeStatement);
    }

    @Delete('/incomeStatement/:id')
    @HttpCode(200)
    @Auth('Accountancy:Delete')
    @ApiOperation({
        operationId: 'DeleteIncomeStatement',
        summary: 'Deletes the income statement',
        description: '',
    })
    @ApiParam({name: 'id', type: Number, required: true})
    @ApiResponse({ status: 200, description: 'Deleted!' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 404, description: 'This income statement could not be found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async deleteIncomeStatement(@Param('id') id: number) {
        const incomeStatement = await this.accountancyRepository.readOneIncomeStatement(id);
        if (!incomeStatement) {
            throw new NotFoundException('This income statement could not be found...');
        }

        await this.accountancyRepository.deleteIncomeStatement(incomeStatement);
    }

    @Get('balance')
    @HttpCode(200)
    @Auth('Accountancy:Read')
    @ApiOperation({
        operationId: 'GetBalance',
        summary: 'Gets the balance',
        description: '',
    })
    @ApiQuery({name: 'till', type: String, required: false})
    @ApiQuery({name: 'name', type: String, required: false})
    @ApiResponse({ status: 200, description: 'Balance', type: BalanceDTO, isArray: true })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async getBalance(@Query('till') till?: string, @Query('name') name?: string): Promise<BalanceDTO[]> {
        return AccountancyTransformer.balance(await this.accountancyRepository.readAllPaymentMethods(till ? new Date(till) : null, name));
    }

    @Post('/balance')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'AddBalance',
        summary: 'Adds a balance / payment method',
        description: '',
    })
    @ApiResponse({ status: 200, description: 'Balance is added!', type: PaymentMethod })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 409, description: 'This balance code already exists...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async addBalance(@Body() body: AddBalanceDTO): Promise<PaymentMethod> {
        if (await this.accountancyRepository.readOnePaymentMethodByCode(body.code)) {
            throw new ConflictException('This balance code already exists...');
        }

        const balance = new PaymentMethod();
        balance.name = body.name;
        balance.code = body.code;
        balance.startAssets = body.startAssets;
        balance.startLiabilities = body.startLiabilities;
        balance.mutations = [];

        return this.accountancyRepository.savePaymentMethod(balance);
    }

    @Put('/balance/:id')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'EditBalance',
        summary: 'Edits a balance / payment method',
        description: '',
    })
    @ApiParam({name: 'id', type: Number, required: true})
    @ApiResponse({ status: 200, description: 'Balance is added!', type: PaymentMethod })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 404, description: 'This balance could not be found...' })
    @ApiResponse({ status: 409, description: 'This balance code already exists...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async editBalance(@Body() body: AddBalanceDTO, @Param('id') id: number): Promise<PaymentMethod> {
        const balance = await this.accountancyRepository.readOnePaymentMethod(id);
        if (!balance) {
            throw new NotFoundException('This balance could not be found...');
        }

        const sharedCodeBalance = await this.accountancyRepository.readOnePaymentMethodByCode(body.code);
        if (sharedCodeBalance && balance.id !== sharedCodeBalance.id) {
            throw new ConflictException('This income statement code already exists...');
        }

        balance.name = body.name;
        balance.code = body.code;
        balance.startAssets = body.startAssets;
        balance.startLiabilities = body.startLiabilities;

        return this.accountancyRepository.savePaymentMethod(balance);
    }

    @Delete('/balance/:id')
    @HttpCode(200)
    @Auth('Accountancy:Delete')
    @ApiOperation({
        operationId: 'DeleteBalance',
        summary: 'Deletes the balance / payment method',
        description: '',
    })
    @ApiParam({name: 'id', type: Number, required: true})
    @ApiResponse({ status: 200, description: 'Deleted!' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 404, description: 'This balance could not be found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async deleteBalance(@Param('id') id: number) {
        const balance = await this.accountancyRepository.readOnePaymentMethod(id);
        if (!balance) {
            throw new NotFoundException('This income statement could not be found...');
        }

        await this.accountancyRepository.deletePaymentMethod(balance);
    }

    @Post('mutation')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'AddMutation',
        summary: 'Adds a mutation',
        description: '',
    })
    @ApiResponse({ status: 200, description: 'Mutation is added!', type: Mutation })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 404, description: 'Income statement or Payment method not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async addMutation(@Body() body: AddMutationDTO): Promise<Mutation> {
        const relations = await Promise.all<IncomeStatement | PaymentMethod>([
            this.accountancyRepository.readOneIncomeStatement(body.incomeStatementId),
            this.accountancyRepository.readOnePaymentMethod(body.paymentMethodId),
        ]);

        if (!relations[0]) {
            throw new NotFoundException('Income statement not found...');
        }

        if (!relations[1]) {
            throw new NotFoundException('Payment method not found...');
        }

        const mutation = new Mutation();
        mutation.description = body.description;
        mutation.date = body.date;
        mutation.amount = body.amount;
        mutation.debtorIban = body.debtorIban;
        mutation.incomeStatement = relations[0] as IncomeStatement;
        mutation.paymentMethod = relations[1] as PaymentMethod;
        mutation.imported = true;

        if (body.entryReference) {
            mutation.entryReference = body.entryReference;
        }

        return this.accountancyRepository.saveMutation(mutation);
    }

    @Get('import')
    @HttpCode(200)
    @Auth('Accountancy:Read')
    @ApiOperation({
        operationId: 'GetNotImportedMutations',
        summary: 'Gets the mutations that are not imported yet',
        description: '',
    })
    @ApiResponse({ status: 200, description: 'Balance', type: NotImportedMutationDTO, isArray: true })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async getNotImportedMutations(): Promise<NotImportedMutationDTO[]> {
        return AccountancyTransformer.mutation(await this.accountancyRepository.readAllNotImportedMutations());
    }

    @Put('/import/:id')
    @HttpCode(200)
    @Auth('Accountancy:Write')
    @ApiOperation({
        operationId: 'importMutation',
        summary: 'Imports a mutation',
        description: '',
    })
    @ApiResponse({ status: 200, description: 'Imported!' })
    @ApiResponse({ status: 400, description: 'Invalid payment method or income statement selected...' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to do this...' })
    @ApiResponse({ status: 404, description: 'Mutation not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    async importMutation(@Param('id') id: number, @Body() body: ImportMutationDTO): Promise<void> {
        const mutation: Mutation = await this.accountancyRepository.readOneMutations(id);
        if (!mutation) {
            throw new NotFoundException('Mutation not found using this id: ' + id);
        }

        const paymentMethod: PaymentMethod = await this.accountancyRepository.readOnePaymentMethod(body.paymentMethodId);
        if (!paymentMethod) {
            throw new BadRequestException('Invalid payment method selected...');
        }

        const incomeStatement: IncomeStatement = await this.accountancyRepository.readOneIncomeStatement(body.incomeStatementId);
        if (!incomeStatement) {
            throw new BadRequestException('Invalid income statement selected...');
        }

        mutation.imported = true;
        mutation.incomeStatement = incomeStatement;
        mutation.paymentMethod = paymentMethod;
        await this.accountancyRepository.saveMutation(mutation);
    }
}

interface AccountsResponse {
    accounts: Array<{
        resourceId: string;
        iban: string;
        currency: string;
        status: string;
        name: string;
        _links: {
            balances: string;
            transactions: string;
        },
    }>;
}