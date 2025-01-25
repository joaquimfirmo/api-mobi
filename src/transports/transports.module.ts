import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { TransportsRepository } from './transports.repository';

@Module({
  controllers: [TransportsController],
  providers: [
    TransportsService,
    TransportsRepository,
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
