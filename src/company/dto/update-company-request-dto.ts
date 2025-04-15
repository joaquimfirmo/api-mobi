import { PartialType } from '@nestjs/mapped-types';
import CreateCompanyRequestDTO from './create-company-request-dto';

export default class UpdateCompanyRequestDTO extends PartialType(
  CreateCompanyRequestDTO,
) {}
