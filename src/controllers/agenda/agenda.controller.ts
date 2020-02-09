import { Controller, Post, Req, Get, HttpCode, Query, Param } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as path from 'path';
import * as pump from 'pump';
import { AgendaRepository } from '../../repositories/agenda.repository';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LANGUAGE } from '../../constants';
import { AgendaTransformer } from '../../transformers/agenda.transformer';
import { AgendaSummaryDTO } from '../../dto/agenda/agenda.summary';
import { AgendaDetailsDTO } from '../../dto/agenda/agenda.details';

@Controller('agenda')
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
  
  @Post()
  createNew(@Req() req): Promise<void> {
    return new Promise((resolve) => {
      function onEnd() {
        console.log('upload completed')
        resolve();
      }
    
      function handler (field, file) {
        pump(file, createWriteStream(path.resolve(__dirname, 'files')))
      }

      req.multipart(handler, onEnd);
    })
  }
}
