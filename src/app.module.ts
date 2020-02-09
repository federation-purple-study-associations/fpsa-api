import { Module } from '@nestjs/common';
import { AgendaController } from './controllers/agenda.controller';
import { AgendaRepository } from './repositories/agenda.repository';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeormConfig = require('./typeorm.config');

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig as TypeOrmModuleOptions)],
  controllers: [AgendaController],
  providers: [AgendaRepository],
})
export class AppModule {}
