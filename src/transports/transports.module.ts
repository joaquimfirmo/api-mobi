import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { TransportsRepository } from './transports.repository';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';

@Module({
  controllers: [TransportsController],
  providers: [
    TransportsRepository,
    TransportsService,
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new Logger(parentClass.constructor.name),
    },
  ],
})
export class TransportsModule {}
