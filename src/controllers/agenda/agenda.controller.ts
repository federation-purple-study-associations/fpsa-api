import { Controller, Post, Get, HttpCode, Query, Param, Body, Res, Delete, NotFoundException, Put, BadRequestException } from '@nestjs/common';
import { createWriteStream, mkdirSync, existsSync, unlinkSync, readFile } from 'fs';
import * as path from 'path';
import { resolve, extname } from 'path';
import { AgendaRepository } from '../../repositories/agenda.repository';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { LANGUAGE } from '../../constants';
import { AgendaTransformer } from '../../transformers/agenda.transformer';
import { AgendaDetailsDTO } from '../../dto/agenda/agenda.details';
import { NewAgendaDTO } from '../../dto/agenda/agenda.new';
import { Auth } from '../../decorators/auth.decorator';
import { AgendaAllDTO } from '../../dto/agenda/agenda.all';
import { UpdateAgendaDTO } from '../../dto/agenda/agenda.update';
import { AgendaItem } from '../../entities/agenda/agenda.item.entity';
import { EmailService } from '../../services/email/email.service';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities/user/user.entity';
import { v4 as uuid } from 'uuid';
import { FastifyReply } from 'fastify';
import * as mime from 'mime-types';

@Controller('agenda')
@ApiTags('agenda')
export class AgendaController {
  private readonly photoUrl: string = resolve(process.env.STORAGE_PATH, 'agenda');

  constructor(
    private readonly agendaRepository: AgendaRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    operationId: 'AgendaGetAll',
    summary: 'getAll',
    description: 'This call can be used to get the complete agenda of FPSA',
  })
  @ApiQuery({name: 'past', required: false})
  @ApiResponse({ status: 200, description: 'All agenda items', type: AgendaAllDTO })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  public async getAll(@Query('lang') language: LANGUAGE, @Query('skip') skip: number, @Query('take') size: number, @Query('past') past: string = 'false'): Promise<AgendaAllDTO> {
    const inPast = past == 'true';

    const promise = await Promise.all([
      this.agendaRepository.getAll(language, skip, size, inPast),
      this.agendaRepository.count(inPast),
    ]);

    return {
      items: AgendaTransformer.toSummary(promise[0]),
      count: promise[1],
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
  public async getOne(@Param('id') id: number, @Query('lang') language: LANGUAGE): Promise<AgendaDetailsDTO> {
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
    description: 'This call can be used to get one agenda item of FPSA',
  })
  @ApiResponse({ status: 200, description: 'The agenda item', type: AgendaItem })
  @ApiResponse({ status: 404, description: 'The agenda item is not found...' })
  @ApiResponse({ status: 500, description: 'Internal server error...' })
  public async getOriginalOne(@Param('id') id: number): Promise<AgendaItem> {
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
  public async getPhoto(@Query('id') id: number, @Res() res: FastifyReply): Promise<void> {
    const item = await this.agendaRepository.getOne(id, 'nl');
    if (!item) {
      throw new NotFoundException('This agenda item is not found...');
    }

    const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.photoUrl, item.imageUrl), (err, data) => Resolve(data)));
    res.type(mime.lookup(item.imageUrl)).send(buffer);
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
  public async createNew(@Body() body: NewAgendaDTO): Promise<void> {
    if (body.image.length === 0) {
      throw new BadRequestException('No document has been uploaded...');
    }

    const agendaItem = AgendaTransformer.fromNew(body);
    await this.agendaRepository.save(agendaItem);

    // Create path if needed
    const dir = resolve(process.env.STORAGE_PATH, 'agenda');
    !existsSync(dir) && mkdirSync(dir);

    await new Promise((resolve) => {
      const stream = createWriteStream(path.resolve(dir, agendaItem.imageUrl), {encoding: 'binary'});
      stream.once('open', () => {
          stream.write(body.image[0].data);
          stream.end();
          resolve(null);
      });
    });

    // Send email if agenda item is not a draft
    if (!agendaItem.isDraft) {
      const users: User[] = await this.userRepository.getAllWhoWantsEventNotification();
      this.emailService.sendEventEmail(agendaItem, users);
    }
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
  public async update(@Param('id') id: number, @Body() body: UpdateAgendaDTO): Promise<void> {
    const agendaItem = await this.agendaRepository.getOneFull(id);
    if (!agendaItem) {
      throw new NotFoundException('Agenda item not found...');
    }

    let photoUrl = agendaItem.imageUrl;
    if (body.image) {
      // Delete old image to preserve storage space
      const dir = resolve(process.env.STORAGE_PATH, 'agenda');
      try {
        unlinkSync(resolve(dir, photoUrl));
      } catch(e) {}

      // Update url name
      photoUrl = uuid() + extname(body.image[0].filename);

      // Add new image
      await new Promise((resolve) => {
        const stream = createWriteStream(path.resolve(dir, photoUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.image[0].data);
            stream.end();
            resolve(null);
        });
      });
    }

    const wasDraft: boolean = agendaItem.isDraft;

    // Update database
    AgendaTransformer.update(agendaItem, body, photoUrl);
    await this.agendaRepository.save(agendaItem);

    // Send email if agenda item is not a draft ANY MORE
    if (wasDraft && body.isDraft === 'false') {
      const users: User[] = await this.userRepository.getAllWhoWantsEventNotification();
      this.emailService.sendEventEmail(agendaItem, users);
    }
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
  public async delete(@Param('id') id: number): Promise<void> {
    const agendaItem = await this.agendaRepository.getOne(id, 'nl');
    if (!agendaItem) {
      throw new NotFoundException('Agenda item not found...');
    }

     // Delete old image to preserve storage space
    const dir = resolve(process.env.STORAGE_PATH, 'agenda');
    unlinkSync(resolve(dir, agendaItem.imageUrl));

    this.agendaRepository.delete(agendaItem);
  }
}
