import { Module } from '@nestjs/common';
import { AgendaController } from './controllers/agenda/agenda.controller';
import { AgendaRepository } from './repositories/agenda.repository';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeormConfig = require('./typeorm.config');
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { UserController } from './controllers/user/user.controller';
import { UserRepository } from './repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from './decorators/auth.decorator';
import { StatisticRepository } from './repositories/statistic.repository';
import { StatisticsController } from './controllers/statistics/statistics.controller';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig as TypeOrmModuleOptions)],
  controllers: [
    AgendaController,
    UserController,
    StatisticsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    LanguageInterceptor,
    AgendaRepository,
    UserRepository,
    StatisticRepository,
  ],
})
export class AppModule {}
