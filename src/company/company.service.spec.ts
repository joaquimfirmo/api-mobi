import { Test, TestingModule } from '@nestjs/testing';
import { Logger, Scope } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';
import { CityService } from '../city/city.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let cityService: CityService;
  let repository: CompanyRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByRazaoSocial: jest.fn(),
            findByCnpj: jest.fn(),
          },
        },
        {
          provide: CityService,
          useValue: {
            findOrCreateCity: jest.fn(),
          },
        },
        {
          provide: Logger,
          scope: Scope.TRANSIENT,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    cityService = module.get<CityService>(CityService);
    repository = module.get<CompanyRepository>(CompanyRepository);
    logger = module.get<Logger>(Logger);
  });

  const mockCompany = {
    id: '1',
    razaoSocial: 'Company 1',
    nomeFantasia: 'Company 1',
    cnpj: '12345678901234',
    email: 'example@email.com',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll method from repository', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([
      {
        id: '1',
        razao_social: 'Company 1',
        nome_fantasia: 'Company 1',
        cnpj: '12345678901234',
        email: 'example@email.com',
        created_at: new Date(),
        updated_at: null,
      },
    ]);
    await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should call findById method from repository and log method from logger when findCompanyById is called', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue([
      {
        id: '1',
        razao_social: 'Company 1',
        nome_fantasia: 'Company 1',
        cnpj: '12345678901234',
        email: 'example@email.com',
        created_at: new Date(),
        updated_at: null,
      },
    ]);
    await service.findOne('1');
    expect(repository.findById).toHaveBeenCalledWith('1');
  });

  it('should call update method from repository and log method from logger when updateCompany is called', async () => {
    const mockUpdate = {
      nomeFantasia: 'Company 1',
    };

    jest.spyOn(repository, 'findById').mockResolvedValue([
      {
        id: '1',
        nome_fantasia: 'Company 1',
        razao_social: 'Company 1',
        cnpj: '12345678901234',
        email: 'example@email.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    jest.spyOn(repository, 'update').mockResolvedValueOnce({
      id: '1',
      nome_fantasia: 'Company 1',
      razao_social: 'Company 1',
      cnpj: '12345678901234',
      email: 'example@email.com',
      created_at: new Date(),
      updated_at: new Date(),
    });
    await service.updateCompany('1', mockUpdate);
    expect(repository.update).toHaveBeenCalledWith('1', mockUpdate);
    expect(logger.log).toHaveBeenCalledWith(
      `Dados para atualização da empresa: ${JSON.stringify(mockUpdate)}`,
    );
  });

  it('should call delete method from repository and log method from logger when deleteCompany is called', async () => {
    const result = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      email: 'example@email.com',
      created_at: new Date(),
      updated_at: null,
    };

    jest.spyOn(repository, 'findById').mockResolvedValue([result]);
    jest.spyOn(repository, 'delete').mockResolvedValue(result);
    await service.deleteCompany('1');
    expect(repository.delete).toHaveBeenCalledWith('1');
    expect(logger.log).toHaveBeenCalledWith(
      `Empresa para ser excluida com o ID:${result.id}`,
    );
  });

  it('should throw an exception if company does not exist', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue([]);
    await expect(service.deleteCompany('1')).rejects.toThrow();
  });

  it('should return true if razao social exists', async () => {
    const mock = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      email: 'example@email.com',
      created_at: new Date(),
      updated_at: null,
    };
    jest.spyOn(repository, 'findByRazaoSocial').mockResolvedValue([mock]);
    const result = await service.verifyRazaoSocialExists('Company 1');
    expect(result).toBe(true);
  });

  it('should return false if razao social does not exist', async () => {
    jest.spyOn(repository, 'findByRazaoSocial').mockResolvedValue([]);
    const result = await service.verifyRazaoSocialExists('Company 1');
    expect(result).toBe(false);
  });

  it('should return true if cnpj exists', async () => {
    const mock = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      email: 'example@email.com',
      created_at: new Date(),
      updated_at: null,
    };
    jest.spyOn(repository, 'findByCnpj').mockResolvedValue([mock]);
    const result = await service.verifyCnpjExists('12345678901234');
    expect(result).toBe(true);
  });

  it('should return false if cnpj does not exist', async () => {
    jest.spyOn(repository, 'findByCnpj').mockResolvedValue([]);
    const result = await service.verifyCnpjExists('12345678901234');
    expect(result).toBe(false);
  });

  it('should create a company successfully', async () => {
    const cityData = {
      id: '1',
      name: 'City 1',
      state: 'State 1',
    };

    jest.spyOn(repository, 'create').mockResolvedValueOnce({
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      email: 'example@email.com',
      created_at: new Date(),
      updated_at: null,
    });
    jest.spyOn(service, 'verifyCnpjExists').mockResolvedValue(false);
    jest.spyOn(service, 'verifyRazaoSocialExists').mockResolvedValue(false);
    jest.spyOn(cityService, 'findOrCreateCity').mockResolvedValue(cityData);

    expect(await service.createCompany(mockCompany)).toEqual({
      id: '1',
      razaoSocial: 'Company 1',
      nomeFantasia: 'Company 1',
      cnpj: '12345678901234',
      email: 'example@email.com',
      createdAt: expect.any(Date),
      updatedAt: null,
    });
  });

  it('should throw an exception if razao social exists', async () => {
    jest.spyOn(service, 'verifyRazaoSocialExists').mockResolvedValue(true);
    jest.spyOn(service, 'verifyCnpjExists').mockResolvedValue(false);

    await expect(service.createCompany(mockCompany)).rejects.toThrow();
  });

  it('should throw an exception if cnpj exists', async () => {
    const mockCompany = {
      id: '1',
      razaoSocial: 'Company 1',
      nomeFantasia: 'Company 1',
      cnpj: '12345678901234',
      email: 'example@email.com',
    };

    jest.spyOn(service, 'verifyRazaoSocialExists').mockResolvedValue(false);
    jest.spyOn(service, 'verifyCnpjExists').mockResolvedValue(true);

    await expect(service.createCompany(mockCompany)).rejects.toThrow();
  });
});
