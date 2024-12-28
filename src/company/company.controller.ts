import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import Company from './entities/company';
import { CreateCompanyRequestDTO, UpdateCompanyRequestDTO } from './dtos';

@Controller('empresas')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompanies(): Promise<Company[]> {
    return this.companyService.findAllCompanies();
  }

  @Get('empresa/:id')
  async getCompany(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ): Promise<Company> {
    return this.companyService.findCompanyById(id);
  }

  @Post('empresa')
  async createCompany(
    @Body() payload: CreateCompanyRequestDTO,
  ): Promise<Company> {
    return this.companyService.createCompany(payload);
  }

  @Put('empresa/:id')
  async updateCompany(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
    @Body() payload: UpdateCompanyRequestDTO,
  ): Promise<Company> {
    return this.companyService.updateCompany(id, payload);
  }

  @Delete('empresa/:id')
  async deleteCompany(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ): Promise<any> {
    return this.companyService.deleteCompany(id);
  }
}
