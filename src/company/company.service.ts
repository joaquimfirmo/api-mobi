import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CityService } from '../city/city.service';
import Company from './entities/company';

@Injectable()
export class CompanyService {
  constructor(
    private readonly logger: Logger,
    private readonly companyRepository: CompanyRepository,
    private readonly cityService: CityService,
  ) {}

  async findAllCompanies(): Promise<any[]> {
    this.logger.log('Buscando todas as empresas');
    return this.companyRepository.findAll();
  }

  async findCompanyById(id: string): Promise<any> {
    this.logger.log(`Buscando empresa com o ID:${id}`);
    const result = await this.companyRepository.findById(id);
    return result[0];
  }

  async createCompany(company: any): Promise<any> {
    this.logger.log(`Criando empresa: ${JSON.stringify(company)}`);
    const cityData = await this.cityService.findOrCreateCity(
      company.cidade,
      company.uf,
      company.codigo_cidade,
    );

    const cnpjExists = await this.verifyCnpjExists(company.cnpj);
    if (cnpjExists) {
      throw new BadRequestException(
        'O CNPJ informado é inválido ou já está cadastrado no sistema',
      );
    }

    const razaoSocialExists = await this.verifyRazaoSocialExists(
      company.razao_social,
    );

    if (razaoSocialExists) {
      throw new BadRequestException(
        'A Razão Social informada é inválida ou já está cadastrada no sistema',
      );
    }

    const newCompany = new Company(
      company.razao_social,
      company.nome_fantasia,
      company.cnpj,
      cityData.id,
    );
    return await this.companyRepository.create(newCompany);
  }

  async updateCompany(id: string, company: any): Promise<any> {
    if (Object.keys(company).length === 0) {
      this.logger.error('Dados para atualização da empresa não informados');
      throw new BadRequestException(
        'Dados para atualização da empresa não informados',
      );
    }
    this.logger.log(`Empresa para ser atualizada ${JSON.stringify(company)}`);

    return this.companyRepository.update(id, company);
  }

  async deleteCompany(id: string): Promise<any> {
    this.logger.log(`Empresa para ser excluida com o ID:${id}`);
    const companyExists = await this.companyRepository.findById(id);

    if (!companyExists) {
      throw new NotFoundException(
        `Empresa com o ID:${id} informado não foi encontrada`,
      );
    }
    const company = await this.companyRepository.delete(id);
    return {
      message: `Empresas com o ID: ${company.id} foi excluída com sucesso`,
    };
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
