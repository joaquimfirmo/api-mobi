import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { CityService } from './city.service';
import { CityRepository } from './city.repository';
import { IbgeModule } from 'src/gateway/ibge/ibge.module';

@Module({
  providers: [
    CityService,
    CityRepository,
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new Logger(parentClass.constructor.name),
    },
  ],
  exports: [CityService],
  imports: [IbgeModule],
})
export class CityModule {}
