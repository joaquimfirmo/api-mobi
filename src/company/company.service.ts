import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IbgeClient } from 'src/gateway/ibge/ibge.client';
import { CompanyRepository } from './company-repository';
import { CityService } from 'src/city/city.service';
import Company from './entities/company';

@Injectable()
export class CompanyService {
  constructor(
    private readonly logger: Logger,
    private readonly companyRepository: CompanyRepository,
    private readonly ibgeClient: IbgeClient,
    private readonly cityService: CityService,
  ) {}

  async findAllCompanies(): Promise<any[]> {
    this.logger.log('Buscando todas as empresas');
    return this.companyRepository.findAll();
  }

  async findCompanyById(id: string): Promise<string> {
    this.logger.log(`Buscando empresa com o ID:${id}`);
    return this.companyRepository.findById(id);
  }

  async createCompany(company: any): Promise<string> {
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

  async updateCompany(id: string, company: any): Promise<string> {
    this.logger.log(`Empresa para ser atualizada ${JSON.stringify(company)}`);
    return this.companyRepository.update(id, company);
  }

  async deleteCompany(id: string): Promise<any> {
    this.logger.log(`Empresa para ser excluida com o ID:${id}`);
    const companyExists = await this.companyRepository.findById(id);

    if (companyExists.length === 0) {
      throw new NotFoundException(
        `Empresa com o ID:${id} informado não foi encontrada`,
      );
    }
    const companyId = await this.companyRepository.delete(id);
    return {
      message: `Empresas com o ID: ${JSON.stringify(companyId)}foi excluída com sucesso`,
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
