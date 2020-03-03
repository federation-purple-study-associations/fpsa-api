import { Controller, Get, Query, HttpCode, Res, NotFoundException, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { LANGUAGE } from '../../constants';
import { BoardInfoDTO } from '../../dto/board/board.info';
import { BoardRepository } from '../../repositories/board.repository';
import { BoardTransformer } from '../../transformers/board.transformer';
import { createReadStream, existsSync, mkdirSync, createWriteStream, unlinkSync } from 'fs';
import { resolve, extname } from 'path';
import { Auth } from '../../decorators/auth.decorator';
import { WriteBoardDTO } from '../../dto/board/board.write';
import { Board } from '../../entities/board/board.entity';

@Controller('board')
@ApiTags('board')
export class BoardController {
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
    @ApiResponse({ status: 200, description: 'All boards', type: BoardInfoDTO, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getBoards(@Query('lang') lang: LANGUAGE, @Query('skip') skip: number, @Query('size') size: number): Promise<BoardInfoDTO[]> {
        return BoardTransformer.toInfo(await this.boardRepository.getAll(lang, skip, size));
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
    async getOriginalOne(@Param('id') id: number): Promise<Board> {
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
        description: 'This call can be used to get the photo of the specific board of FPSA',
    })
    @ApiResponse({ status: 200, description: 'All boards', type: BoardInfoDTO, isArray: true })
    public async getPicture(@Query('id') id: number, @Res() res: any): Promise<void>  {
        const item = await this.boardRepository.getOne(id, 'nl');
        if (!item) {
            throw new NotFoundException('This board is not found...');
        }

        const stream = createReadStream(resolve(process.env.STORAGE_PATH, 'board', item.photoUrl))
        res.type('image/' + extname(item.photoUrl).substr(1)).send(stream)
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
    async createNew(@Body() body: WriteBoardDTO): Promise<void> {
        console.log(body)
        const board = BoardTransformer.fromNew(body);
        await this.boardRepository.save(board);

        // Create path if needed
        const dir = resolve(process.env.STORAGE_PATH, 'board');
        !existsSync(dir) && mkdirSync(dir);

        const stream = createWriteStream(resolve(dir, board.photoUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.image[0].data);
            stream.end();
        });
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
    async update(@Param('id') id: number, @Body() body: WriteBoardDTO): Promise<void> {
        const board = await this.boardRepository.getOneFull(id);
        if (!board) {
            throw new NotFoundException('Board not found...');
        }

        if (body.image) {
            // Delete old image to preserve storage space
            const dir = resolve(process.env.STORAGE_PATH, 'board');
            try {
                unlinkSync(resolve(dir, board.photoUrl));
            } catch(e) {}

            // Add new image
            const stream = createWriteStream(resolve(dir, board.photoUrl), {encoding: 'binary'});
            stream.once('open', () => {
                stream.write(body.image[0].data);
                stream.end();
            });
        }

        // Update database
        BoardTransformer.update(board, body, !!body.image);
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
    async delete(@Param('id') id: number): Promise<void> {
        const agendaItem = await this.boardRepository.getOne(id, 'nl');
        if (!agendaItem) {
            throw new NotFoundException('Board not found...');
        }

        this.boardRepository.delete(agendaItem);

        // Delete old image to preserve storage space
        const dir = resolve(process.env.STORAGE_PATH, 'board');
        unlinkSync(resolve(dir, agendaItem.photoUrl));
    }
}
