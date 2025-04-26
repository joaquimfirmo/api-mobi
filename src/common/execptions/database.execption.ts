import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseException extends InternalServerErrorException {
  constructor(
    message: string,
    error?: any,
    context: string = 'DatabaseException',
  ) {
    super(
      ` ${message}${error?.message ? `: ${error.message}` : ''}`,
      error?.stack,
    );
    this.name = context;
  }
}
