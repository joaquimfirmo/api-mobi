import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';
import { CompanyController } from './company.controller';
import { IbgeModule } from 'src/gateway/ibge/ibge.module';
import { CityModule } from 'src/city/city.module';

@Module({
  providers: [
    CompanyService,
    CompanyRepository,
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new Logger(parentClass.constructor.name),
    },
  ],
  controllers: [CompanyController],
  imports: [IbgeModule, CityModule],
})
export class CompanyModule {}
