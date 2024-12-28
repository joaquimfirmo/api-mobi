import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { HttpException, Logger, Scope } from '@nestjs/common';
import { IbgeClient } from './ibge.client';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

type city = {
  id: number | null;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
} | null;

describe('IbgeClient', () => {
  let httpService: HttpService;
  let logger: Logger;

  const mockData = {
    id: 1,
    nome: 'São Paulo',
    microrregiao: {
      id: 35031,
      nome: 'São Paulo',
      mesorregiao: {
        id: 3515,
        nome: 'Metropolitana de São Paulo',
        UF: {
          id: 35,
          sigla: 'SP',
          nome: 'São Paulo2',
          regiao: {
            id: 3,
            sigla: 'SE',
            nome: 'Sudeste',
          },
        },
      },
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IbgeClient,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
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

    httpService = module.get<HttpService>(HttpService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    const service = new IbgeClient(httpService, logger);
    expect(service).toBeDefined();
  });

  it('should call getCitiesByState method', async () => {
    const service = new IbgeClient(httpService, logger);
    const data: city[] = [mockData];

    const response: AxiosResponse<city[]> = {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: undefined,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(
      new Observable<AxiosResponse<city[]>>((subscriber) => {
        subscriber.next(response);
        subscriber.complete();
      }),
    );

    await service.getCitiesByState(35);
    expect(logger.log).toHaveBeenCalledWith(
      'Buscando cidades do estado com codigo 35',
    );
    expect(httpService.get).toHaveBeenCalledWith(
      '/localidades/estados/35/municipios',
      {
        params: {
          orderBy: 'nome',
        },
      },
    );
  });

  it('should call getCityByCode method', async () => {
    const service = new IbgeClient(httpService, logger);
    const data: city = mockData;
    const response: AxiosResponse<city> = {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: undefined,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(
      new Observable<AxiosResponse<city>>((subscriber) => {
        subscriber.next(response);
        subscriber.complete();
      }),
    );

    const result = await service.getCityByCode(1);
    expect(logger.log).toHaveBeenCalledWith('Buscando cidade com codigo 1');
    expect(httpService.get).toHaveBeenCalledWith('/localidades/municipios/1', {
      params: {
        orderBy: 'nome',
      },
    });
    expect(result).toEqual({
      id: 1,
      nome: 'São Paulo',
      uf: 'SP',
    });
  });

  it('should return null when city is not found', async () => {
    const service = new IbgeClient(httpService, logger);
    const data: city = null;
    const response: AxiosResponse<city> = {
      data: {
        ...data,
        id: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: undefined,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(
      new Observable<AxiosResponse<city>>((subscriber) => {
        subscriber.next(response);
        subscriber.complete();
      }),
    );
    const result = await service.getCityByCode(1);
    expect(result).toEqual({
      id: null,
      nome: null,
      uf: null,
    });
  });

  it('should return false when city is invalid', async () => {
    const service = new IbgeClient(httpService, logger);
    const data: city = null;
    const response: AxiosResponse<city> = {
      data: {
        ...data,
        id: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: undefined,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(
      new Observable<AxiosResponse<city>>((subscriber) => {
        subscriber.next(response);
        subscriber.complete();
      }),
    );
    const result = await service.isValidCity('São Paulooo', 1);
    expect(result).toBe(false);
  });

  it('should return false when city name is different', async () => {
    const service = new IbgeClient(httpService, logger);
    jest.spyOn(service, 'getCityByCode').mockResolvedValueOnce({
      id: 1,
      nome: 'São Paulo',
      uf: 'SP',
    });
    const result = await service.isValidCity('São Paulo do Norte', 1);
    expect(result).toBe(false);
  });

  it('should throw an error when state is not found', async () => {
    const service = new IbgeClient(httpService, logger);
    const error = {
      name: 'Error',
      message: 'Estado não encontrado',
      code: '404',
      request: {},
      response: {
        data: 'Erro ao buscar cidades por estado',
        status: 500,
        statusText: 'Not Found',
        headers: {},
        config: undefined,
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(
      new Observable<AxiosResponse<city[]>>((subscriber) => {
        subscriber.error(error);
      }),
    );

    await expect(service.getCitiesByState(35)).rejects.toEqual(
      new HttpException('Erro ao buscar cidades por estado', 500),
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Erro ao buscar cidades por estado',
    );
  });

  it('should throw an error when city is not found', async () => {
    const service = new IbgeClient(httpService, logger);
    const error = {
      name: 'Error',
      message: 'Cidade não encontrada',
      code: '404',
      request: {},
      response: {
        data: 'Cidade não encontrada',
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: undefined,
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(
      new Observable<AxiosResponse<city>>((subscriber) => {
        subscriber.error(error);
      }),
    );

    await expect(service.getCityByCode(1)).rejects.toEqual(
      new HttpException('Erro ao buscar cidades por código do IBGE', 404),
    );
    expect(logger.error).toHaveBeenCalledWith(error);
  });
});
