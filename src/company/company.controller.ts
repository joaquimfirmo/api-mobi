import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('empresa')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('empresas')
  async getCompanies(): Promise<string[]> {
    return this.companyService.getCompanies();
  }

  @Get('empresa/:id')
  async getCompany(@Param('id') id: string): Promise<string> {
    return this.companyService.getCompanyById(id);
  }

  @Post('empresa')
  async createCompany(@Body() city: any): Promise<string> {
    return this.companyService.createCompany(city);
  }

  @Put('empresa/:id')
  async updateCompany(
    @Param('id') id: string,
    @Body() city: any,
  ): Promise<string> {
    return this.companyService.updateCompany(id, city);
  }
}
