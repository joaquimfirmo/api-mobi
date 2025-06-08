import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { TransportsRepository } from './transports.repository';
import { CompanyModule } from '../company/company.module';
import { RoutesModule } from '../route/routes.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';

@Module({
  imports: [CompanyModule, RoutesModule, ScheduleModule, VehiclesModule],
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
