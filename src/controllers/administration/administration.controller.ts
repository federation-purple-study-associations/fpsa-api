import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/auth.decorator';
import { Me } from '../../decorators/me.decorator';
import { User } from '../../entities/user/user.entity';
import { AdministrationRepository } from '../../repositories/administration.repository';
import { ActivityPlan } from '../../entities/administration/activity.plan.entity';
import { CreateActivityPlan } from '../../dto/administration/create.activity.plan';
import { AdministrationTransformer } from '../../transformers/administration.transformer';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { extname, resolve } from 'path';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime-types';

@Controller('administration')
@ApiTags('administration')
export class AdministrationController {
    private readonly documentUrl: string = resolve(process.env.STORAGE_PATH, 'administration', 'activityPlan');

    constructor(
        private readonly administrationRepository: AdministrationRepository,
    ) {}

    @Get('activityplan')
    @Auth('Administration:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ActivityPlanGetAll',
        summary: 'getAll',
        description: 'This call can be used to get all of the activity plans. Based on your account you will get all of your activity plan (if you have roleId 2), or you will get all of the activity plans in the db (if you have roleId 1)',
    })
    @ApiQuery({name: 'skip', required: false})
    @ApiQuery({name: 'size', required: false})
    @ApiResponse({ status: 200, description: 'Activity plans returned', type: ActivityPlan, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public getAllActivityPlans(@Me() me: User, @Query('skip') skip?: number, @Query('size') size?: number): Promise<ActivityPlan[]> {
        return this.administrationRepository.readAllActivityPlans(me.roleId === 1 ? undefined : me, skip, size);
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
    @ApiResponse({ status: 403, description: 'You are not allowed to update this acitivity plan...' })
    @ApiResponse({ status: 404, description: 'No activity plan found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getActivityPlanDocument(@Me() me: User, @Param('id') id: number, @Res() res: any): Promise<void> {
        const activityPlan = await this.getActivityPlan(id, me);

        const stream = createWriteStream(resolve(this.documentUrl, activityPlan.documentUrl));
        res.type(mime.lookup(activityPlan.documentUrl)).send(stream);
    }

    @Post('activityplan')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'ActivityPlanCreate',
        summary: 'create',
        description: 'This call can be used to save a new activity plan',
    })
    @ApiResponse({ status: 202, description: 'Activity plan saved!' })
    @ApiResponse({ status: 400, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async createActivityPlan(@Body() body: CreateActivityPlan, @Me() me: User): Promise<void> {
        this.checkMimeType(body.document[0]);

        const activityPlan = AdministrationTransformer.toActivityPlan(body, me);
        await activityPlan.save();

        // Create path if needed
        !existsSync(this.documentUrl) && mkdirSync(this.documentUrl, { recursive: true });

        const stream = createWriteStream(resolve(this.documentUrl, activityPlan.documentUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.document[0].data);
            stream.end();
        });
    }

    @Put('activityplan/:id')
    @Auth('Administration:Write')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'ActivityPlanUpdate',
        summary: 'update',
        description: 'This call can be used to update the activity plan',
    })
    @ApiResponse({ status: 202, description: 'Activity plan updated!' })
    @ApiResponse({ status: 400, description: 'Upload is not a PDF-file...' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this acitivity plan...' })
    @ApiResponse({ status: 404, description: 'No activity plan found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async updateActivityPlan(@Body() body: CreateActivityPlan, @Me() me: User, @Param('id') id: number): Promise<void> {
        const activityPlan = await this.getActivityPlan(id, me);

        let documentUrl = activityPlan.documentUrl;
        if (body.document) {
            this.checkMimeType(body.document[0]);

            // Delete old document to preserve storage space
            try {
                unlinkSync(resolve(this.documentUrl, documentUrl));
            } catch(e) {}

            // Update url name
            documentUrl = uuid() + extname(body.document[0].filename);

            // Add new document
            const stream = createWriteStream(resolve(this.documentUrl, documentUrl), {encoding: 'binary'});
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
    @ApiResponse({ status: 202, description: 'Activity plan updated!' })
    @ApiResponse({ status: 403, description: 'You are not allowed to update this acitivity plan...' })
    @ApiResponse({ status: 404, description: 'No activity plan found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async deleteActivityPlan(@Param('id') id: number, @Me() me: User): Promise<void> {
        const activityPlan = await this.getActivityPlan(id, me);

        unlinkSync(resolve(this.documentUrl, activityPlan.documentUrl));
        await this.administrationRepository.delete(activityPlan);
    }

    private async getActivityPlan(id: number, me: User): Promise<ActivityPlan> {
        const activityPlan = await this.administrationRepository.readOneActivityPlan(id);
        if (!activityPlan) {
            throw new NotFoundException('No activity plan found...');
        }
        if (activityPlan.user.id !== me.id && me.roleId === 2) {
            throw new ForbiddenException('You are not allowed to update this acitivity plan...');
        }

        return activityPlan;
    }

    private checkMimeType(document: any): void {
        if (mime.lookup(document.filename) !== 'application/pdf') {
            throw new BadRequestException('Upload is not a PDF-file...');
        }
    }
}
