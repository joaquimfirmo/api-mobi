import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleRepository } from './schedule.repository';

@Module({
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new Logger(parentClass.constructor.name),
    },
  ],
})
export class ScheduleModule {}
