import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, PreconditionFailedException, Put, Query, Res } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/auth.decorator';
import { Me } from '../../decorators/me.decorator';
import { User } from '../../entities/user/user.entity';
import { AdministrationRepository } from '../../repositories/administration.repository';
import { ActivityPlan } from '../../entities/administration/activity.plan.entity';
import { CreateActivityPlan } from '../../dto/administration/create.activity.plan';
import { AdministrationTransformer } from '../../transformers/administration.transformer';
import { createWriteStream, existsSync, mkdirSync, unlinkSync, readFile } from 'fs';
import { extname, resolve } from 'path';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime-types';
import { UserRepository } from '../../repositories/user.repository';
import { EmailService } from '../../services/email/email.service';
import { CreateAnnualReport } from '../../dto/administration/create.annual.report';
import { ResultActivityPlan } from '../../dto/administration/result.activity.plan';
import { ResultAnnualReport } from '../../dto/administration/result.annual.report';
import { ResultBoardGrant } from '../../dto/administration/result.board.grant';
import { BoardGrant } from '../../entities/administration/board.grant.entity';
import { CreateBoardGrant } from '../../dto/administration/create.board.grant';

@Controller('administration')
@ApiTags('administration')
export class AdministrationController {
    private readonly activityPlanDocumentUrl: string = resolve(process.env.STORAGE_PATH, 'administration', 'activityPlan');
    private readonly annualReportDocumentUrl: string = resolve(process.env.STORAGE_PATH, 'administration', 'annualReport');
    private readonly boardGrantDocumentUrl: string = resolve(process.env.STORAGE_PATH, 'administration', 'boardGrant');

    constructor(
        private readonly administrationRepository: AdministrationRepository,
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
    ) {}

    @Get('activityplan')
    @Auth('Administration:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ActivityPlanGetAll',
        summary: 'getAll',
        description: 'This call can be used to get all of the activity plans. Based on your account you will get all of your activity plan (if you have roleId 2), or you will get all of the activity plans in the db (if you have roleId 1 or 3)',
    })
    @ApiQuery({name: 'skip', required: false})
    @ApiQuery({name: 'size', required: false})
    @ApiResponse({ status: 200, description: 'Activity plans returned', type: ResultActivityPlan })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getAllActivityPlans(@Me() me: User, @Query('skip') skip?: number, @Query('size') size?: number): Promise<ResultActivityPlan> {
        const user = me.roleId !== 2 ? undefined : me;
        const results = await Promise.all([
            this.administrationRepository.countActivityPlans(user),
            this.administrationRepository.readAllActivityPlans(user, skip, size),
        ]);

        return { count: results[0], activityPlans: results[1] };
    }

    @Get('activityplan/:id/document')
    @Auth('Administration:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ActivityPlanGetDocument',
        summary: 'getDocument',
        description: 'This call can be used to get the PDF of the activity plan',
    })
    @ApiResponse({ status: 200, description: 'Activity plan document returned' })
    @ApiResponse({ status: 403, description: 'You are not allowed to get this acitivity plan...' })
    @ApiResponse({ status: 404, description: 'No activity plan found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getActivityPlanDocument(@Me() me: User, @Param('id') id: number, @Res() res: any): Promise<void> {
        const activityPlan = await this.getActivityPlan(id, me);

        const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.activityPlanDocumentUrl, activityPlan.documentUrl), (err, data) => Resolve(data)));
        res.type(mime.lookup(activityPlan.documentUrl)).send(buffer);
    }

    @Post('activityplan')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'ActivityPlanCreate',
        summary: 'create',
        description: 'This call can be used to save a new activity plan',
    })
    @ApiResponse({ status: 202, description: 'Activity plan saved!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 412, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async createActivityPlan(@Body() body: CreateActivityPlan, @Me() me: User): Promise<void> {
        if (body.document.length === 0) {
            throw new BadRequestException('No document has been uploaded...');
        }
        this.checkMimeType(body.document[0]);

        const activityPlan = AdministrationTransformer.toActivityPlan(body, me);
        await activityPlan.save();

        // Create path if needed
        !existsSync(this.activityPlanDocumentUrl) && mkdirSync(this.activityPlanDocumentUrl, { recursive: true });

        const stream = createWriteStream(resolve(this.activityPlanDocumentUrl, activityPlan.documentUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.document[0].data);
            stream.end();
        });

        await this.emailService.sendActivityPlanConfirmation(me, activityPlan);
    }

    @Put('activityplan/:id')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'ActivityPlanUpdate',
        summary: 'update',
        description: 'This call can be used to update the activity plan',
    })
    @ApiResponse({ status: 202, description: 'Activity plan updated!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this acitivity plan...' })
    @ApiResponse({ status: 404, description: 'No activity plan found...' })
    @ApiResponse({ status: 412, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async updateActivityPlan(@Body() body: CreateActivityPlan, @Me() me: User, @Param('id') id: number): Promise<void> {
        const activityPlan = await this.getActivityPlan(id, me);

        let documentUrl = activityPlan.documentUrl;
        if (body.document) {
            this.checkMimeType(body.document[0]);

            // Delete old document to preserve storage space
            try {
                unlinkSync(resolve(this.activityPlanDocumentUrl, documentUrl));
            } catch(e) {}

            // Update url name
            documentUrl = uuid() + extname(body.document[0].filename);

            // Add new document
            const stream = createWriteStream(resolve(this.activityPlanDocumentUrl, documentUrl), {encoding: 'binary'});
            stream.once('open', () => {
                stream.write(body.document[0].data);
                stream.end();
            });
        }

        AdministrationTransformer.updateActivityPlan(activityPlan, body, documentUrl);
        await activityPlan.save();
    }

    @Delete('activityplan/:id')
    @Auth('Administration:Delete')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'ActivityPlanDelete',
        summary: 'delete',
        description: 'This call can be used to delete the activity plan',
    })
    @ApiResponse({ status: 202, description: 'Activity plan deleted!' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this acitivity plan...' })
    @ApiResponse({ status: 404, description: 'No activity plan found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async deleteActivityPlan(@Param('id') id: number, @Me() me: User): Promise<void> {
        const activityPlan = await this.getActivityPlan(id, me);

        unlinkSync(resolve(this.activityPlanDocumentUrl, activityPlan.documentUrl));
        await this.administrationRepository.delete(activityPlan);
    }

    @Post('activityplan/check')
    @Auth('Administration:System')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ActivityPlanCheck',
        summary: 'check',
        description: 'This call can be used to check the end dates of each user\'s last activity plan',
    })
    @ApiResponse({ status: 202, description: 'Checked!' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this acitivity plan...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async doCheckActivityPlans(): Promise<void> {
        const today = new Date();

        const users = await this.userRepository.getAllMembers();
        users.forEach(async (user) => {
            if (user.activityPlans.length === 0) {
                return;
            }

            const activityPlan = user.activityPlans[user.activityPlans.length -1];
            if (activityPlan.end.getDate() === today.getDate() &&
                activityPlan.end.getMonth() === today.getMonth() &&
                activityPlan.end.getFullYear() === today.getFullYear()) {

                    await this.emailService.sendActivityPlanReminder(user);
            }
        });
    }

    @Get('annualReport')
    @Auth('Administration:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'AnnualReportGetAll',
        summary: 'getAll',
        description: 'This call can be used to get all of the annual reports. Based on your account you will get all of your annual reports (if you have roleId 2), or you will get all of the annual reports in the db (if you have roleId 1 or 3)',
    })
    @ApiQuery({name: 'skip', required: false})
    @ApiQuery({name: 'size', required: false})
    @ApiResponse({ status: 200, description: 'Annual reports returned', type: ResultAnnualReport })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getAnnualReports(@Me() me: User, @Query('skip') skip?: number, @Query('size') size?: number): Promise<ResultAnnualReport> {
        const user = me.roleId !== 2 ? undefined : me;
        const results = await Promise.all([
            this.administrationRepository.countAnnualReports(user),
            this.administrationRepository.readAllAnnualReports(user, skip, size),
        ]);

        return { count: results[0], annualReports: results[1] }
    }

    @Get('annualReport/:id/document')
    @Auth('Administration:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'AnnualReportGetDocument',
        summary: 'getDocument',
        description: 'This call can be used to get the PDF of the annual report',
    })
    @ApiResponse({ status: 200, description: 'Annual report document returned' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this annual report...' })
    @ApiResponse({ status: 404, description: 'No annual report found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getAnnualReportDocument(@Param('id') id: number, @Res() res: any): Promise<void> {
        const annualReport = await this.administrationRepository.readOneAnnualReport(id);
        if (!annualReport) {
            throw new NotFoundException('No annual report found...');
        }

        const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.annualReportDocumentUrl, annualReport.documentUrl), (err, data) => Resolve(data)));
        res.type(mime.lookup(annualReport.documentUrl)).send(buffer);
    }

    @Post('annualReport')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'AnnualReportCreate',
        summary: 'create',
        description: 'This call can be used to save a new annual report',
    })
    @ApiResponse({ status: 202, description: 'Annual report saved!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 404, description: 'Activity plan not found...' })
    @ApiResponse({ status: 412, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async createAnnualReport(@Body() body: CreateAnnualReport, @Me() me: User): Promise<void> {
        if (body.document.length === 0) {
            throw new BadRequestException('No document has been uploaded...');
        }
        this.checkMimeType(body.document[0]);

        const annualReport = AdministrationTransformer.toAnnualReport(body, me);
        await annualReport.save();

        // Create path if needed
        !existsSync(this.annualReportDocumentUrl) && mkdirSync(this.annualReportDocumentUrl, { recursive: true });

        const stream = createWriteStream(resolve(this.annualReportDocumentUrl, annualReport.documentUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.document[0].data);
            stream.end();
        });

        await this.emailService.sendAnnualReportConfirmation(me);
    }

    @Put('annualReport/:id')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'AnnualReportUpdate',
        summary: 'update',
        description: 'This call can be used to update the annualReport',
    })
    @ApiResponse({ status: 202, description: 'Annual report updated!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this acitivity plan...' })
    @ApiResponse({ status: 404, description: 'No annual report or activity pan found...' })
    @ApiResponse({ status: 412, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async updateAnnualReport(@Body() body: CreateAnnualReport, @Param('id') id: number): Promise<void> {
        const annualReport = await this.administrationRepository.readOneAnnualReport(id);
        if (!annualReport) {
            throw new NotFoundException('No annual report found...');
        }

        let documentUrl = annualReport.documentUrl;
        if (body.document) {
            this.checkMimeType(body.document[0]);

            // Delete old document to preserve storage space
            try {
                unlinkSync(resolve(this.annualReportDocumentUrl, documentUrl));
            } catch(e) {}

            // Update url name
            documentUrl = uuid() + extname(body.document[0].filename);

            // Add new document
            const stream = createWriteStream(resolve(this.annualReportDocumentUrl, documentUrl), {encoding: 'binary'});
            stream.once('open', () => {
                stream.write(body.document[0].data);
                stream.end();
            });
        }

        AdministrationTransformer.updateAnnualReport(annualReport, documentUrl);
        await annualReport.save();
    }

    @Delete('annualReport/:id')
    @Auth('Administration:Delete')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'AnnualReportDelete',
        summary: 'delete',
        description: 'This call can be used to delete the annual report',
    })
    @ApiResponse({ status: 202, description: 'Annual report deleted!' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this annual report...' })
    @ApiResponse({ status: 404, description: 'No annual report found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async deleteAnnualReport(@Param('id') id: number): Promise<void> {
        const annualReport = await this.administrationRepository.readOneAnnualReport(id);
        if (!annualReport) {
            throw new NotFoundException('No annual report found...');
        }

        unlinkSync(resolve(this.annualReportDocumentUrl, annualReport.documentUrl));
        await this.administrationRepository.delete(annualReport);
    }

    @Get('boardGrant')
    @Auth('Administration:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'BoardGrantGetAll',
        summary: 'getAll',
        description: 'This call can be used to get all of the board garnts. Based on your account you will get all of your board grant (if you have roleId 2), or you will get all of the board grants in the db (if you have roleId 1 or 3)',
    })
    @ApiQuery({name: 'skip', required: false})
    @ApiQuery({name: 'size', required: false})
    @ApiResponse({ status: 200, description: 'Activity plans returned', type: ResultBoardGrant })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getAllBoardGrants(@Me() me: User, @Query('skip') skip?: number, @Query('size') size?: number): Promise<ResultBoardGrant> {
        const user = me.roleId !== 2 ? undefined : me;
        const [count, boardGrants] = await Promise.all([
            this.administrationRepository.countBoardGrants(user),
            this.administrationRepository.readAllBoardGrants(user, skip, size),
        ]);

        return { count, boardGrants };
    }

    @Get('boardGrant/:id/document')
    @Auth('Administration:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'BoardGrantGetDocument',
        summary: 'getDocument',
        description: 'This call can be used to get the PDF of the board grant',
    })
    @ApiResponse({ status: 200, description: 'Board grant document returned' })
    @ApiResponse({ status: 403, description: 'You are not allowed to get this board grant...' })
    @ApiResponse({ status: 404, description: 'No board grant found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getBoardGrantDocument(@Me() me: User, @Param('id') id: number, @Res() res: any): Promise<void> {
        const boardGrant = await this.getBoardGrant(id, me);

        const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.boardGrantDocumentUrl, boardGrant.documentUrl), (err, data) => Resolve(data)));
        res.type(mime.lookup(boardGrant.documentUrl)).send(buffer);
    }

    @Post('boardGrant')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'BoardGrantCreate',
        summary: 'create',
        description: 'This call can be used to save a new board grant',
    })
    @ApiResponse({ status: 202, description: 'Board grant saved!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 412, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async createBoardGrant(@Body() body: CreateBoardGrant, @Me() me: User): Promise<void> {
        if (body.document.length === 0) {
            throw new BadRequestException('No document has been uploaded...');
        }
        this.checkMimeType(body.document[0]);

        const boardGrant = AdministrationTransformer.toBoardGrant(body, me);
        await this.administrationRepository.save(boardGrant);

        // Create path if needed
        !existsSync(this.boardGrantDocumentUrl) && mkdirSync(this.boardGrantDocumentUrl, { recursive: true });

        const stream = createWriteStream(resolve(this.boardGrantDocumentUrl, boardGrant.documentUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.document[0].data);
            stream.end();
        });

        await this.emailService.sendBoardGrantConfirmation(me);
    }

    @Put('boardGrant/:id')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'BoardGrantUpdate',
        summary: 'update',
        description: 'This call can be used to update the board grant',
    })
    @ApiResponse({ status: 202, description: 'Board grant updated!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this board grant...' })
    @ApiResponse({ status: 404, description: 'No board grant found...' })
    @ApiResponse({ status: 412, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async updateBoardGrant(@Body() body: CreateBoardGrant, @Me() me: User, @Param('id') id: number): Promise<void> {
        const boardGrant = await this.getBoardGrant(id, me);

        let documentUrl = boardGrant.documentUrl;
        if (body.document) {
            this.checkMimeType(body.document[0]);

            // Delete old document to preserve storage space
            try {
                unlinkSync(resolve(this.boardGrantDocumentUrl, documentUrl));
            } catch(e) {}

            // Update url name
            documentUrl = uuid() + extname(body.document[0].filename);

            // Add new document
            const stream = createWriteStream(resolve(this.boardGrantDocumentUrl, documentUrl), {encoding: 'binary'});
            stream.once('open', () => {
                stream.write(body.document[0].data);
                stream.end();
            });
        }

        AdministrationTransformer.updateBoardGrant(boardGrant, documentUrl);
        await this.administrationRepository.save(boardGrant);
    }

    @Put('boardGrant/:id/checked')
    @Auth('Administration:System')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'BoardGrantCheck',
        summary: 'check',
        description: 'This call can be used to update the status of the board grant to checked',
    })
    @ApiResponse({ status: 200, description: 'Board grant checked!' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this board grant...' })
    @ApiResponse({ status: 404, description: 'No board grant found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async boardGrantChecked(@Param('id') id: number): Promise<void> {
        const boardGrant = await this.administrationRepository.readOneBoardGrant(id);
        if (!boardGrant) {
            throw new NotFoundException('No board grant found...');
        }

        AdministrationTransformer.boardGrantChecked(boardGrant);
        await this.administrationRepository.save(boardGrant);
    } 

    @Delete('boardGrant/:id')
    @Auth('Administration:Delete')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'BoardGrantDelete',
        summary: 'delete',
        description: 'This call can be used to delete the boardGrant',
    })
    @ApiResponse({ status: 202, description: 'Activity plan deleted!' })
    @ApiResponse({ status: 403, description: 'You are not allowed to get this boardGrant...' })
    @ApiResponse({ status: 404, description: 'No activity plan found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async deleteBoardGrant(@Param('id') id: number, @Me() me: User): Promise<void> {
        const boardGrant = await this.getBoardGrant(id, me);

        unlinkSync(resolve(this.boardGrantDocumentUrl, boardGrant.documentUrl));
        await this.administrationRepository.delete(boardGrant);
    }

    private async getActivityPlan(id: number, me: User): Promise<ActivityPlan> {
        const activityPlan = await this.administrationRepository.readOneActivityPlan(id);
        if (!activityPlan) {
            return null;
        }
        if (activityPlan.user.id !== me.id && me.roleId === 2) {
            throw new ForbiddenException('You are not allowed to update this acitivity plan...');
        }

        return activityPlan;
    }

    private async getBoardGrant(id: number, me: User): Promise<BoardGrant> {
        if (id === 0) {
            return null;
        }

        const boardGrant = await this.administrationRepository.readOneBoardGrant(id);
        if (!boardGrant) {
            throw new NotFoundException('No board grant found...');
        }
        if (boardGrant.user.id !== me.id && me.roleId === 2) {
            throw new ForbiddenException('You are not allowed to update this board grant...');
        }

        return boardGrant;
    }

    private checkMimeType(document: any): void {
        if (mime.lookup(document.filename) !== 'application/pdf') {
            throw new PreconditionFailedException('Upload is not a PDF-file...');
        }
    }
}
