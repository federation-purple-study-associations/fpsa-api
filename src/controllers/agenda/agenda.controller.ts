import { Controller, Post, Get, HttpCode, Query, Param, Body, Res, Delete, NotFoundException, Put } from '@nestjs/common';
import { createWriteStream, mkdirSync, existsSync, createReadStream, unlinkSync } from 'fs';
import { resolve, extname } from 'path';
import { AgendaRepository } from '../../repositories/agenda.repository';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { LANGUAGE } from '../../constants';
import { AgendaTransformer } from '../../transformers/agenda.transformer';
import { AgendaDetailsDTO } from '../../dto/agenda/agenda.details';
import { NewAgendaDTO } from '../../dto/agenda/agenda.new';
import { Auth } from '../../decorators/auth.decorator';
import { AgendaAllDTO } from '../../dto/agenda/agenda.all';
import { UpdateAgendaDTO } from '../../dto/agenda/agenda.update';
import { AgendaItem } from '../../entities/agenda/agenda.item.entity';

@Controller('agenda')
@ApiTags('agenda')
export class AgendaController {

  constructor(
    private readonly agendaRepository: AgendaRepository,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    operationId: 'AgendaGetAll',
    summary: 'getAll',
    description: 'This call can be used to get the complete agenda of FPSA',
  })
  @ApiResponse({ status: 200, description: 'All agenda items', type: AgendaAllDTO })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async getAll(@Query('lang') language: LANGUAGE, @Query('skip') skip: number, @Query('size') size: number): Promise<AgendaAllDTO> {
    const promise = await Promise.all([
      this.agendaRepository.getAll(language, skip, size),
      this.agendaRepository.count()
    ]);

    return {
      items: AgendaTransformer.toSummary(promise[0]),
      count: promise[1]
    };
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({
    operationId: 'AgendaGetOne',
    summary: 'getOne',
    description: 'This call can be used to get the one agenda item of FPSA',
  })
  @ApiResponse({ status: 200, description: 'The agenda item', type: AgendaDetailsDTO })
  @ApiResponse({ status: 404, description: 'The agenda item is not found...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async getOne(@Param('id') id: number, @Query('lang') language: LANGUAGE): Promise<AgendaDetailsDTO> {
    const agendaItem = await this.agendaRepository.getOne(id, language);
    if (!agendaItem) {
      throw new NotFoundException('Agenda item not found...');
    }

    return AgendaTransformer.toDetails(agendaItem);
  }

  @Get('original/:id')
  @HttpCode(200)
  @ApiOperation({
    operationId: 'AgendaGetOriginalOne',
    summary: 'getOriginalOne',
    description: 'This call can be used to get the one agenda item of FPSA',
  })
  @ApiResponse({ status: 200, description: 'The agenda item', type: AgendaItem })
  @ApiResponse({ status: 404, description: 'The agenda item is not found...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async getOriginalOne(@Param('id') id: number): Promise<AgendaItem> {
    const agendaItem = await this.agendaRepository.getOneFull(id);
    if (!agendaItem) {
      throw new NotFoundException('Agenda item not found...');
    }

    return agendaItem
  }

  @Get('/photo')
  @HttpCode(200)
  @ApiOperation({
    operationId: 'AgendaGetPicture',
    summary: 'getPicture',
    description: 'This call can be used to get the image of an agenda item',
  })
  @ApiResponse({ status: 200, description: 'The agenda item' })
  @ApiResponse({ status: 404, description: 'The agenda item is not found...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async getPhoto(@Query('id') id: number, @Res() res): Promise<void> {
    const item = await this.agendaRepository.getOne(id, 'nl');
    const stream = createReadStream(resolve(process.env.STORAGE_PATH, 'agenda', item.imageUrl))
    res.type('image/' + extname(item.imageUrl).substr(1)).send(stream)
  }
  
  @Post()
  @Auth('Agenda:Write')
  @HttpCode(202)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    operationId: 'AgendaCreateNew',
    summary: 'create',
    description: 'This call can be used to get the one agenda item of FPSA',
  })
  @ApiResponse({ status: 202, description: 'Agenda item created' })
  @ApiResponse({ status: 400, description: 'Validation error...' })
  @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async createNew(@Body() body: NewAgendaDTO): Promise<void> {
    const agendaItem = AgendaTransformer.fromNew(body);
    await this.agendaRepository.save(agendaItem);

    // Create path if needed
    const dir = resolve(process.env.STORAGE_PATH, 'agenda');
    !existsSync(dir) && mkdirSync(dir);

    const stream = createWriteStream(resolve(dir, agendaItem.imageUrl), {encoding: 'binary'});
    stream.once('open', () => {
        stream.write(body.image.data);
        stream.end();
    });
  }

  @Put(':id')
  @Auth('Agenda:Write')
  @HttpCode(202)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    operationId: 'AgendaUpdate',
    summary: 'update',
    description: 'This call can be used to update one agenda item of FPSA',
  })
  @ApiResponse({ status: 202, description: 'Agenda item updated' })
  @ApiResponse({ status: 400, description: 'Validation error...' })
  @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
  @ApiResponse({ status: 404, description: 'Agenda item not found...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async update(@Param('id') id: number, @Body() body: UpdateAgendaDTO): Promise<void> {
    const agendaItem = await this.agendaRepository.getOneFull(id);
    if (!agendaItem) {
      throw new NotFoundException('Agenda item not found...');
    }

    if (body.image) {
      console.log(body.image)
      // Create path if needed
      const dir = resolve(process.env.STORAGE_PATH, 'agenda');
      !existsSync(dir) && mkdirSync(dir);

      // Delete old image to preserve storage space
      try {
        unlinkSync(resolve(dir, agendaItem.imageUrl));
      } catch(e) {}

      // Add new image
      const stream = createWriteStream(resolve(dir, agendaItem.imageUrl), {encoding: 'binary'});
      stream.once('open', () => {
          stream.write(body.image.data);
          stream.end();
      });
    }

    // Update database
    AgendaTransformer.update(agendaItem, body, !!body.image);
    await this.agendaRepository.save(agendaItem);
  }

  @Delete(':id')
  @Auth('Agenda:Delete')
  @HttpCode(202)
  @ApiOperation({
    operationId: 'AgendaDelete',
    summary: 'delete',
    description: 'This call can be used to delete one agenda item of FPSA',
  })
  @ApiResponse({ status: 202, description: 'Agenda item deleted' })
  @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
  @ApiResponse({ status: 404, description: 'Agenda item not found...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async delete(@Param('id') id: number): Promise<void> {
    const agendaItem = await this.agendaRepository.getOne(id, 'nl');
    if (!agendaItem) {
      throw new NotFoundException('Agenda item not found...');
    }

    // Create path if needed
    const dir = resolve(process.env.STORAGE_PATH, 'agenda');
    !existsSync(dir) && mkdirSync(dir);

    // Delete old image to preserve storage space
    unlinkSync(resolve(dir, agendaItem.imageUrl));

    this.agendaRepository.delete(agendaItem);
  }
}
