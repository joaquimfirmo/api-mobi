import { Test, TestingModule } from '@nestjs/testing';
import { Logger, Scope } from '@nestjs/common';
import { CityService } from './city.service';
import { CityRepository } from './city.repository';
import { IbgeClient } from '../gateway/ibge/ibge.client';

describe('CityService', () => {
  let service: CityService;
  let repository: CityRepository;
  let logger: Logger;
  let ibgeClient: IbgeClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: Logger,
          scope: Scope.TRANSIENT,
          useValue: {
            log: jest.fn(),
          },
        },

        {
          provide: CityRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByNameAndCode: jest.fn(),
          },
        },
        {
          provide: IbgeClient,
          useValue: {
            isValidCity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<CityRepository>(CityRepository);
    logger = module.get<Logger>(Logger);
    ibgeClient = module.get<IbgeClient>(IbgeClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAllCities method from repository', async () => {
    await service.findAllCities();
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should call getCityById method from repository', async () => {
    await service.getCityById('1');
    expect(repository.findById).toHaveBeenCalled();
  });

  it('should call isValidCity method from ibgeClient', async () => {
    jest
      .spyOn(ibgeClient, 'isValidCity')
      .mockResolvedValueOnce({ isValid: true });

    await service.isValidCity('name', 1);

    expect(ibgeClient.isValidCity).toHaveBeenCalledWith('name', 1);
  });

  it('should return true when  ibgeClient isValidCity returns true', async () => {
    jest
      .spyOn(ibgeClient, 'isValidCity')
      .mockResolvedValueOnce({ isValid: true });

    const result = await service.isValidCity('name', 1);

    expect(result).toBe(true);
  });

  it('should return false when  ibgeClient isValidCity returns false', async () => {
    jest
      .spyOn(ibgeClient, 'isValidCity')
      .mockResolvedValueOnce({ isValid: false });

    const result = await service.isValidCity('name', 1);

    expect(result).toBe(false);
  });

  it('should call findOrCreateCity method from repository', async () => {
    jest.spyOn(repository, 'findByNameAndCode').mockResolvedValueOnce([
      {
        id: '1',
        nome: 'name',
        uf: 'uf',
        cod_ibge: 1,
      },
    ]);
    await service.findOrCreateCity('name', 'uf', 1);
    expect(repository.findByNameAndCode).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      'Buscando cidade com nome name e código 1',
    );
    expect(logger.log).toHaveBeenCalledWith(
      'Cidade encontrada: {"id":"1","nome":"name","uf":"uf","cod_ibge":1}',
    );
  });

  it('should throw an error if city is invalid', async () => {
    jest.spyOn(repository, 'findByNameAndCode').mockResolvedValueOnce([]);
    jest
      .spyOn(ibgeClient, 'isValidCity')
      .mockResolvedValueOnce({ isValid: false });

    await expect(service.findOrCreateCity('name', 'uf', 1)).rejects.toThrow(
      'Cidade inválida',
    );
  });

  it('should create a city if it does not exist', async () => {
    jest.spyOn(repository, 'findByNameAndCode').mockResolvedValueOnce([]);
    jest
      .spyOn(ibgeClient, 'isValidCity')
      .mockResolvedValueOnce({ isValid: true });

    await service.findOrCreateCity('name', 'uf', 1);

    expect(repository.create).toHaveBeenCalled();
  });

  it('should return a city if it already exists', async () => {
    jest.spyOn(repository, 'findByNameAndCode').mockResolvedValueOnce([
      {
        id: '1',
        nome: 'name',
        uf: 'uf',
        cod_ibge: 1,
      },
    ]);

    const result = await service.findOrCreateCity('name', 'uf', 1);

    expect(result).toEqual({
      id: '1',
      nome: 'name',
      uf: 'uf',
      cod_ibge: 1,
    });
  });

  it('should call isValidCity method from ibgeClient when city does not exist', async () => {
    jest
      .spyOn(ibgeClient, 'isValidCity')
      .mockResolvedValueOnce({ isValid: true });
    jest.spyOn(repository, 'findByNameAndCode').mockResolvedValueOnce([]);
    await service.findOrCreateCity('name', 'uf', 1);
    expect(ibgeClient.isValidCity).toHaveBeenCalled();
  });
});
