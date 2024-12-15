import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import CreateCompanyDto from './dtos/create-company-dto';
type Company = {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  id_cidade: string;
  created_at: Date | string;
  updated_at: Date | string | null;
};
@Controller('empresas')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompanies(): Promise<Company[]> {
    return this.companyService.findAllCompanies();
  }

  @Get('empresa/:id')
  async getCompany(@Param('id') id: string): Promise<string> {
    return this.companyService.findCompanyById(id);
  }

  @Post('empresa')
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<string> {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Put('empresa/:id')
  async updateCompany(
    @Param('id') id: string,
    @Body() company: any,
  ): Promise<any> {
    return this.companyService.updateCompany(id, company);
  }

  @Delete('empresa/:id')
  async deleteCompany(@Param('id') id: string): Promise<string> {
    return this.companyService.deleteCompany(id);
  }
}
