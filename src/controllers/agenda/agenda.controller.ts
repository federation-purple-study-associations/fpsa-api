import { Controller, Post, Get, HttpCode, Query, Param, Body, Res } from '@nestjs/common';
import { createWriteStream, mkdirSync, existsSync, createReadStream } from 'fs';
import { resolve, extname } from 'path';
import { AgendaRepository } from '../../repositories/agenda.repository';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LANGUAGE } from '../../constants';
import { AgendaTransformer } from '../../transformers/agenda.transformer';
import { AgendaSummaryDTO } from '../../dto/agenda/agenda.summary';
import { AgendaDetailsDTO } from '../../dto/agenda/agenda.details';
import { NewAgendaDTO } from '../../dto/agenda/agenda.new';

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
  @ApiResponse({ status: 200, description: 'All agenda items', type: AgendaSummaryDTO, isArray: true })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async getAll(@Query('lang') language: LANGUAGE): Promise<AgendaSummaryDTO[]> {
    const items = await this.agendaRepository.getAll(language);
    return AgendaTransformer.toSummary(items);
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({
    operationId: 'AgendaGetOne',
    summary: 'getOne',
    description: 'This call can be used to get the one agenda item of FPSA',
  })
  @ApiResponse({ status: 200, description: 'The agenda item', type: AgendaDetailsDTO })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async getOne(@Param('id') id: number, @Query('lang') language: LANGUAGE): Promise<AgendaDetailsDTO> {
    const item = await this.agendaRepository.getOne(id, language);
    return AgendaTransformer.toDetails(item);
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
  @HttpCode(201)
  @ApiOperation({
    operationId: 'AgendaCreateNew',
    summary: 'getOne',
    description: 'This call can be used to get the one agenda item of FPSA',
  })
  @ApiResponse({ status: 201, description: 'Agenda item created' })
  @ApiResponse({ status: 400, description: 'Validation error...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  async createNew(@Body() body: NewAgendaDTO): Promise<void> {
    const agendaItem = AgendaTransformer.fromNew(body);
    await agendaItem.save();

    // Create path if needed
    const dir = resolve(process.env.STORAGE_PATH, 'agenda');
    !existsSync(dir) && mkdirSync(dir);

    const stream = createWriteStream(resolve(dir, agendaItem.imageUrl), {encoding: 'binary'});
    stream.once('open', () => {
        stream.write(body.image.data);
        stream.end();
    });
  }
}
