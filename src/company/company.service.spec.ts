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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll method from repository', async () => {
    await service.findAllCompanies();
    expect(repository.findAll).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith('Buscando todas as empresas');
  });

  it('should call findById method from repository and log method from logger when findCompanyById is called', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue([
      {
        id: '1',
        razao_social: 'Company 1',
        nome_fantasia: 'Company 1',
        cnpj: '12345678901234',
        city_id: '1',
      },
    ]);
    await service.findCompanyById('1');
    expect(repository.findById).toHaveBeenCalledWith('1');
    expect(logger.log).toHaveBeenCalledWith('Buscando empresa com o ID:1');
  });

  it('should call update method from repository and log method from logger when updateCompany is called', async () => {
    const mockUpdate = {
      nome_fantasia: 'Company 1',
    };
    await service.updateCompany('1', mockUpdate);
    expect(repository.update).toHaveBeenCalledWith('1', mockUpdate);
    expect(logger.log).toHaveBeenCalledWith(
      `Empresa para ser atualizada ${JSON.stringify(mockUpdate)}`,
    );
  });

  it('should call delete method from repository and log method from logger when deleteCompany is called', async () => {
    const result = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      city_id: '1',
    };

    jest.spyOn(repository, 'findById').mockResolvedValue(result);
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
    jest
      .spyOn(repository, 'findByRazaoSocial')
      .mockResolvedValue(['Company 1']);
    const result = await service.verifyRazaoSocialExists('Company 1');
    expect(result).toBe(true);
  });

  it('should return false if razao social does not exist', async () => {
    jest.spyOn(repository, 'findByRazaoSocial').mockResolvedValue([]);
    const result = await service.verifyRazaoSocialExists('Company 1');
    expect(result).toBe(false);
  });

  it('should return true if cnpj exists', async () => {
    jest.spyOn(repository, 'findByCnpj').mockResolvedValue(['12345678901234']);
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

    const mockCompany = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      city_id: cityData.id,
    };

    jest.spyOn(repository, 'create').mockResolvedValue({
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      city_id: '1',
    });
    jest.spyOn(service, 'verifyCnpjExists').mockResolvedValue(false);
    jest.spyOn(service, 'verifyRazaoSocialExists').mockResolvedValue(false);
    jest.spyOn(cityService, 'findOrCreateCity').mockResolvedValue(cityData);

    const result = await service.createCompany(mockCompany);

    expect(result).toEqual(mockCompany);
  });

  it('should throw an exception if razao social exists', async () => {
    const mockCompany = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      city_id: '1',
    };

    jest.spyOn(service, 'verifyRazaoSocialExists').mockResolvedValue(true);
    jest.spyOn(service, 'verifyCnpjExists').mockResolvedValue(false);

    await expect(service.createCompany(mockCompany)).rejects.toThrow();
  });

  it('should throw an exception if cnpj exists', async () => {
    const mockCompany = {
      id: '1',
      razao_social: 'Company 1',
      nome_fantasia: 'Company 1',
      cnpj: '12345678901234',
      city_id: '1',
    };

    jest.spyOn(service, 'verifyRazaoSocialExists').mockResolvedValue(false);
    jest.spyOn(service, 'verifyCnpjExists').mockResolvedValue(true);

    await expect(service.createCompany(mockCompany)).rejects.toThrow();
  });
});
