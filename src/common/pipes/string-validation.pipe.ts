import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class StringValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string' || !isNaN(Number(value))) {
      throw new BadRequestException(
        'Validation failed: Parameter is not a valid string',
      );
    }
    return value;
  }
}
