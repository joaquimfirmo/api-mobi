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
            findAllCompanies: jest.fn(),
            findCompanyById: jest.fn(),
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
        razao_social: 'Company 1',
        nome_fantasia: 'Company 1',
        cnpj: '123456789012',
        id_cidade: '1',
        created_at: new Date(),
        updated_at: null,
      },
      {
        id: '2',
        razao_social: 'Company 2',
        nome_fantasia: 'Company 2',
        cnpj: '123456789013',
        id_cidade: '2',
        created_at: new Date(),
        updated_at: null,
      },
    ];

    jest.spyOn(service, 'findAllCompanies').mockResolvedValueOnce(companies);
    expect(await controller.getCompanies()).toBe(companies);
    expect(service.findAllCompanies).toHaveBeenCalledTimes(1);
  });

  it('should call findCompanyById method from service', async () => {
    const company = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '123456789012',
      id_cidade: '1',
      created_at: new Date(),
      updated_at: null,
    };

    jest.spyOn(service, 'findCompanyById').mockResolvedValueOnce([company]);
    expect(await controller.getCompany('1')).toEqual([company]);
    expect(service.findCompanyById).toHaveBeenCalledTimes(1);
  });

  it('should call createCompany method from service', async () => {
    const company = {
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '123456789012',
      cidade: 'City 1',
      uf: 'UF',
      codigo_cidade: 1222,
    };

    const result = {
      ...company,
      id: '1',
      id_cidade: '1',
      created_at: new Date(),
      updated_at: null,
    };

    jest.spyOn(service, 'createCompany').mockResolvedValueOnce(result);
    expect(await controller.createCompany(company)).toBe(result);
    expect(service.createCompany).toHaveBeenCalledTimes(1);
  });

  it('should call updateCompany method from service', async () => {
    const company = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '123456789012',
      cidade: 'City 1',
      uf: 'UF',
      codigo_cidade: 1222,
    };

    const result = {
      ...company,
      razao_social: 'Company 2',
      created_at: new Date(),
      updated_at: new Date(),
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

    const deleteMessage = {
      messagem: `Empresas com o ID: ${JSON.stringify(company.id)}foi excluída com sucesso`,
    };

    jest.spyOn(service, 'deleteCompany').mockResolvedValueOnce(deleteMessage);
    expect(await controller.deleteCompany('1')).toBe(deleteMessage);
    expect(service.deleteCompany).toHaveBeenCalledTimes(1);
  });
});
