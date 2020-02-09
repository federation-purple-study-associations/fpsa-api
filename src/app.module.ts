import { Module } from '@nestjs/common';
import { AgendaController } from './controllers/agenda/agenda.controller';
import { AgendaRepository } from './repositories/agenda.repository';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeormConfig = require('./typeorm.config');
import { LanguageInterceptor } from './interceptors/language.interceptor';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig as TypeOrmModuleOptions)],
  controllers: [
    AgendaController
  ],
  providers: [
    LanguageInterceptor,
    AgendaRepository
  ],
})
export class AppModule {}
