import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { VehiclesService } from './vehicles.service';
import { VehiclesRepository } from './vehicles.repository';
import { VehiclesController } from './vehicles.controller';

@Module({
  exports: [VehiclesRepository],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    VehiclesRepository,
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new Logger(parentClass.constructor.name),
    },
  ],
})
export class VehiclesModule {}
