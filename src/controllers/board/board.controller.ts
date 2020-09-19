import { Controller, Get, Query, HttpCode, Res, NotFoundException, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { LANGUAGE } from '../../constants';
import { BoardInfoTotalDTO } from '../../dto/board/board.info';
import { BoardRepository } from '../../repositories/board.repository';
import { BoardTransformer } from '../../transformers/board.transformer';
import { existsSync, mkdirSync, createWriteStream, unlinkSync, readFile } from 'fs';
import { resolve, extname } from 'path';
import { Auth } from '../../decorators/auth.decorator';
import { WriteBoardDTO } from '../../dto/board/board.write';
import { Board } from '../../entities/board/board.entity';
import * as mime from 'mime-types';
import { v4 as uuid } from 'uuid';

@Controller('board')
@ApiTags('board')
export class BoardController {
    private readonly photoUrl: string = resolve(process.env.STORAGE_PATH, 'board', 'photo');
    private readonly policyUrl: string = resolve(process.env.STORAGE_PATH, 'board', 'policy');

    constructor(
        private readonly boardRepository: BoardRepository,
    ) {}

    @Get()
    @HttpCode(200)
    @ApiOperation({
        operationId: 'BoardGetAll',
        summary: 'getAll',
        description: 'This call can be used to get all of the boards of FPSA',
    })
    @ApiResponse({ status: 200, description: 'All boards', type: BoardInfoTotalDTO })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getBoards(@Query('lang') lang: LANGUAGE, @Query('skip') skip: number, @Query('size') size: number): Promise<BoardInfoTotalDTO> {
        const promises = await Promise.all([
            this.boardRepository.getAll(lang, skip, size),
            this.boardRepository.count(),
        ])
        return BoardTransformer.toInfo(...promises);
    }

    @Get('original/:id')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'BoardGetOriginalOne',
        summary: 'getOriginalOne',
        description: 'This call can be used to get a board of FPSA',
    })
    @ApiResponse({ status: 200, description: 'The Board', type: Board })
    @ApiResponse({ status: 404, description: 'The Board is not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getOriginalOne(@Param('id') id: number): Promise<Board> {
        const board = await this.boardRepository.getOneFull(id);
        if (!board) {
            throw new NotFoundException('Board not found...');
        }

        return board
    }

    @Get('photo')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'BoardGetPhoto',
        summary: 'getPhoto',
        description: 'This call can be used to get the photo of the specific board',
    })
    @ApiResponse({ status: 200, description: 'Board photo' })
    @ApiResponse({ status: 404, description: 'This board is not found...' })
    public async getPicture(@Query('id') id: number, @Res() res: any): Promise<void>  {
        const item = await this.boardRepository.getOne(id, 'nl');
        if (!item) {
            throw new NotFoundException('This board is not found...');
        }

        const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.photoUrl, item.photoUrl), (err, data) => Resolve(data)));
        res.type(mime.lookup(item.photoUrl)).send(buffer);
    }

    @Get('policy')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'BoardGetPolicy',
        summary: 'getPolicy',
        description: 'This call can be used to get the policy plan of the specific board',
    })
    @ApiResponse({ status: 200, description: 'Board photo' })
    @ApiResponse({ status: 404, description: 'This board is not found or has no policy plan...' })
    public async getPolicy(@Query('id') id: number, @Res() res: any): Promise<void>  {
        const item = await this.boardRepository.getOne(id, 'nl');
        if (!item || !item.policyPlanUrl) {
            throw new NotFoundException('This board is not found or has no policy plan...');
        }

        const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.policyUrl, item.policyPlanUrl), (err, data) => Resolve(data)));
        res.type(mime.lookup(item.policyPlanUrl)).send(buffer);
    }

    @Post()
    @Auth('Board:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'BoardCreate',
        summary: 'create',
        description: 'This call can be used to a new board for FPSA',
    })
    @ApiResponse({ status: 202, description: 'Board created' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async createNew(@Body() body: WriteBoardDTO): Promise<void> {
        const board = BoardTransformer.fromNew(body);
        await this.boardRepository.save(board);

        // Create path if needed
        !existsSync(this.photoUrl) && mkdirSync(this.photoUrl, { recursive: true });

        const stream = createWriteStream(resolve(this.photoUrl, board.photoUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.image[0].data);
            stream.end();
        });

        // A policy plan is not required in order to create a board
        if (body.policy) {
            !existsSync(this.policyUrl) && mkdirSync(this.policyUrl, { recursive: true });

            const streamPolicy = createWriteStream(resolve(this.policyUrl, board.policyPlanUrl), {encoding: 'binary'});
            streamPolicy.once('open', () => {
                streamPolicy.write(body.policy[0].data);
                streamPolicy.end();
            });
        }
    }

    @Put(':id')
    @Auth('Board:Write')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'Boardpdate',
        summary: 'update',
        description: 'This call can be used to update a board of FPSA',
    })
    @ApiResponse({ status: 202, description: 'Board updated' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 404, description: 'Board not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async update(@Param('id') id: number, @Body() body: WriteBoardDTO): Promise<void> {
        const board = await this.boardRepository.getOneFull(id);
        if (!board) {
            throw new NotFoundException('Board not found...');
        }
        let photoUrl = board.photoUrl;
        let policyUrl = board.policyPlanUrl;

        if (body.image) {
            // Delete old image to preserve storage space
            try {
                unlinkSync(resolve(this.photoUrl, photoUrl));
            } catch(e) {}

            // Update url name
            photoUrl = uuid() + extname(body.image[0].filename);

            // Add new image
            const stream = createWriteStream(resolve(this.photoUrl, photoUrl), {encoding: 'binary'});
            stream.once('open', () => {
                stream.write(body.image[0].data);
                stream.end();
            });
        }

        if (body.policy) {
            // Delete old policy plan to preserve storage space
            try {
                unlinkSync(resolve(this.policyUrl, policyUrl));
            } catch(e) {}

            // Update url name
            policyUrl = uuid() + extname(body.policy[0].filename);

            // Add new policy plan
            const stream = createWriteStream(resolve(this.policyUrl, policyUrl), {encoding: 'binary'});
            stream.once('open', () => {
                stream.write(body.policy[0].data);
                stream.end();
            });
        }

        // Update database
        BoardTransformer.update(board, body, photoUrl, policyUrl);
        await this.boardRepository.save(board);
    }

    @Delete(':id')
    @Auth('Board:Delete')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'BoardDelete',
        summary: 'delete',
        description: 'This call can be used to delete a board of FPSA',
    })
    @ApiResponse({ status: 202, description: 'Board deleted' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 404, description: 'Board not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async delete(@Param('id') id: number): Promise<void> {
        const agendaItem = await this.boardRepository.getOne(id, 'nl');
        if (!agendaItem) {
            throw new NotFoundException('Board not found...');
        }

        this.boardRepository.delete(agendaItem);

        // Delete the image & policy plan to preserve storage space
        unlinkSync(resolve(this.photoUrl, agendaItem.photoUrl));
        unlinkSync(resolve(this.policyUrl, agendaItem.policyPlanUrl));
    }
}
