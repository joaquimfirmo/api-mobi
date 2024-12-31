import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            createCompany: jest.fn(),
            updateCompany: jest.fn(),
            deleteCompany: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAllCompanies method from service', async () => {
    const companies = [
      {
        id: '1',
        razaoSocial: 'Company 1',
        nomeFantasia: 'Company 1',
        cnpj: '123456789012',
        idCidade: '1',
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: '2',
        razaoSocial: 'Company 2',
        nomeFantasia: 'Company 2',
        cnpj: '123456789013',
        idCidade: '2',
        createdAt: new Date(),
        updatedAt: null,
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValueOnce(companies);
    expect(await controller.findAll()).toBe(companies);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should call findOne method from service', async () => {
    const company = {
      id: '1',
      razaoSocial: 'Company 1',
      nomeFantasia: 'Company 1',
      cnpj: '123456789012',
      idCidade: '1',
      createdAt: new Date(),
      updatedAt: null,
    };

    jest.spyOn(service, 'findOne').mockResolvedValueOnce(company);
    expect(await controller.findOne('1')).toEqual(company);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should call createCompany method from service', async () => {
    const company = {
      razaoSocial: 'Company 1',
      nomeFantasia: 'Company 1',
      cnpj: '123456789012',
      cidade: 'City 1',
      uf: 'UF',
      codigoCidade: 1222,
    };

    const result = {
      razaoSocial: 'Company 1',
      nomeFantasia: 'Company 1',
      cnpj: '123456789012',
      cidade: 'City 1',
      uf: 'UF',
      id: '1',
      idCidade: '1',
      createdAt: new Date(),
      updatedAt: null,
    };

    jest.spyOn(service, 'createCompany').mockResolvedValueOnce(result);
    expect(await controller.createCompany(company)).toBe(result);
    expect(service.createCompany).toHaveBeenCalledTimes(1);
  });

  it('should call updateCompany method from service', async () => {
    const company = {
      id: '1',
      razaoSocial: 'Company 1',
      nomeFantasia: 'Company 1',
      cnpj: '123456789012',
      cidade: 'City 1',
      uf: 'UF',
      codigo_cidade: 1222,
    };

    const result = {
      ...company,
      razaoSocial: 'Company 2',
      idCidade: '2',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'updateCompany').mockResolvedValueOnce(result);
    expect(await controller.updateCompany('1', company)).toBe(result);
    expect(service.updateCompany).toHaveBeenCalledTimes(1);
  });

  it('should call deleteCompany method from service', async () => {
    const company = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '123456789012',
      id_cidade: '1',
      created_at: new Date(),
      updated_at: null,
    };

    const deleteMessage = `Empresas com o ID: ${JSON.stringify(company.id)}foi excluída com sucesso`;

    jest.spyOn(service, 'deleteCompany').mockResolvedValueOnce(deleteMessage);
    expect(await controller.deleteCompany('1')).toBe(deleteMessage);
    expect(service.deleteCompany).toHaveBeenCalledTimes(1);
  });
});
