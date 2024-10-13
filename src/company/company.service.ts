import { Injectable, Logger } from '@nestjs/common';
import { CompanyRepository } from './company-repository';

@Injectable()
export class CompanyService {
  constructor(
    private readonly logger: Logger,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async getCompanies(): Promise<string[]> {
    this.logger.log('Getting all companies');
    return this.companyRepository.findAll();
  }

  async getCompanyById(id: string): Promise<string> {
    this.logger.log('Getting company by id', id);
    return this.companyRepository.findById(id);
  }

  async createCompany(city: any): Promise<string> {
    this.logger.log('Creating company', city);
    this.companyRepository.create(city);
    this.logger.log('Company created', city);
    return 'Company created';
  }

  async updateCompany(id: string, city: any): Promise<string> {
    this.logger.log('Updating company', {
      id,
      city,
    });
    this.companyRepository.update(id, city);
    this.logger.log('Company updated', {
      id,
      city,
    });
    return 'Company updated';
  }
}
