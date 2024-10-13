import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company-repository';
import { CompanyController } from './company.controller';

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
})
export class CompanyModule {}
