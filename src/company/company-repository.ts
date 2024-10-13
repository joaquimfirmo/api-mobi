import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyRepository {
  async findAll(): Promise<string[]> {
    return ['Company 1', 'Company 2', 'Company 3'];
  }

  async findById(id: string): Promise<string> {
    return `Company ${id}`;
  }

  async create(city: any): Promise<string> {
    return 'Company created';
  }

  async update(id: string, city: any): Promise<string> {
    return 'Company updated';
  }
}
