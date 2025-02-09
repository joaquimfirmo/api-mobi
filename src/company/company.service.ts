import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CityService } from '../city/city.service';
import Company from './entities/company.entity';
import { CreateCompanyRequestDTO, UpdateCompanyRequestDTO } from './dtos';

@Injectable()
export class CompanyService {
  constructor(
    private readonly logger: Logger,
    private readonly companyRepository: CompanyRepository,
    private readonly cityService: CityService,
  ) {}

  async findAll(): Promise<Company[]> {
    const result = await this.companyRepository.findAll();
    return result.map(
      (company) =>
        new Company(
          company.razao_social,
          company.nome_fantasia,
          company.cnpj,
          company.email,
          company.id,
          company.created_at,
          company.updated_at,
        ),
    );
  }

  async findOne(id: string): Promise<Company> {
    const result = await this.companyRepository.findById(id);

    if (result.length === 0) {
      throw new NotFoundException(
        `Empresa com o ID:${id} informado não foi encontrada`,
      );
    }

    return new Company(
      result[0].razao_social,
      result[0].nome_fantasia,
      result[0].cnpj,
      result[0].email,
      result[0].id,
      result[0].created_at,
      result[0].updated_at,
    );
  }

  async createCompany(company: CreateCompanyRequestDTO): Promise<Company> {
    this.logger.log(`Criando empresa: ${JSON.stringify(company)}`);

    const cnpjExists = await this.verifyCnpjExists(company.cnpj);

    if (cnpjExists) {
      throw new BadRequestException(
        'O CNPJ informado é inválido ou já está cadastrado no sistema',
      );
    }

    const razaoSocialExists = await this.verifyRazaoSocialExists(
      company.razaoSocial,
    );

    if (razaoSocialExists) {
      throw new BadRequestException(
        'A Razão Social informada é inválida ou já está cadastrada no sistema',
      );
    }

    const newCompany = new Company(
      company.razaoSocial,
      company.nomeFantasia,
      company.cnpj,
      company.email,
    );

    const result = await this.companyRepository.create(newCompany);

    return new Company(
      result.razao_social,
      result.nome_fantasia,
      result.cnpj,
      result.email,
      result.id,
      result.created_at,
      result.updated_at,
    );
  }

  async updateCompany(
    id: string,
    company: UpdateCompanyRequestDTO,
  ): Promise<Company> {
    if (Object.keys(company).length === 0) {
      this.logger.error('Dados para atualização da empresa não informados');

      throw new BadRequestException(
        'Dados para atualização da empresa não informados',
      );
    }

    const companyExist = await this.companyRepository.findById(id);

    if (companyExist.length === 0) {
      throw new NotFoundException(
        `Empresa com o ID:${id} informado não foi encontrada`,
      );
    }

    this.logger.log(
      `Dados para atualização da empresa: ${JSON.stringify(company)}`,
    );

    const updatedCompany = await this.companyRepository.update(id, company);

    return new Company(
      updatedCompany.razao_social,
      updatedCompany.nome_fantasia,
      updatedCompany.cnpj,
      updatedCompany.email,
      updatedCompany.id,
      updatedCompany.created_at,
      updatedCompany.updated_at,
    );
  }

  async deleteCompany(id: string): Promise<string> {
    this.logger.log(`Empresa para ser excluida com o ID:${id}`);
    const companyExists = await this.companyRepository.findById(id);

    if (!companyExists.length) {
      throw new NotFoundException(
        `Empresa com o ID:${id} informado não foi encontrada`,
      );
    }
    const company = await this.companyRepository.delete(id);

    this.logger.log(`Empresa com o ID:${id} foi excluída com sucesso`);

    return JSON.stringify(
      `Empresas com o ID: ${company.id} foi excluída com sucesso`,
    );
  }

  async verifyCnpjExists(cnpj: string): Promise<boolean> {
    this.logger.log(`Verificando se o CNPJ: ${cnpj} já existe`);
    const result = await this.companyRepository.findByCnpj(cnpj);
    return result.length > 0 ? true : false;
  }

  async verifyRazaoSocialExists(razaoSocial: string): Promise<boolean> {
    this.logger.log(`Verificando se a Razão Social: ${razaoSocial} já existe`);
    const result = await this.companyRepository.findByRazaoSocial(razaoSocial);
    return result.length > 0 ? true : false;
  }
}
