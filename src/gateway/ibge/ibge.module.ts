import { Module, Logger, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { IbgeClient } from './ibge.client';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.IBGE_API_URL,
      timeout: 5000,
    }),
  ],
  providers: [
    IbgeClient,
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new Logger(parentClass.constructor.name),
    },
  ],
  exports: [IbgeClient],
})
export class IbgeModule {}
