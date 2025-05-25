import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseException extends InternalServerErrorException {
  constructor(
    message: string,
    error?: any,
    context: string = 'DatabaseException',
  ) {
    super(
      error?.message
        ? `${message}: Detalhes do erro: ${error.message}`
        : message,
      error?.stack,
    );
    this.name = context;
  }
}
