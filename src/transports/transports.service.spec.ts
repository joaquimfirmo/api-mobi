import { Test, TestingModule } from '@nestjs/testing';
import { Logger, Scope } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsRepository } from './transports.repository';
import { DiasSemana } from '../types/enums/dias-semana.enum';

describe('TransportsService', () => {
  let service: TransportsService;
  let repository: TransportsRepository;
  let logger: Logger;

  const mockTransports = [
    {
      rota: 'Cidade A - Cidade B',
      empresa: 'Empresa A',
      distancia_km: '60',
      duracao: {
        hours: 1,
      },
      veiculo: 'Van',
      horario_partida: '07:00:00',
      horario_chegada: '08:00:00',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportsService,
        {
          provide: TransportsRepository,
          useValue: {
            findAll: jest.fn(),
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

    service = module.get<TransportsService>(TransportsService);
    repository = module.get<TransportsRepository>(TransportsRepository);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll method from repository', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValueOnce(mockTransports);
    const filters = {
      DiaSemana: DiasSemana.SegundaFeira,
    };

    const result = await service.findAll(filters, 1, 10);
    expect(repository.findAll).toHaveBeenCalledWith(filters, 1, 10);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      `Fetching transports with filters: ${JSON.stringify(filters)}`,
    );
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTransports);
  });

  it('should log error when findAll fails', async () => {
    const filters = {
      DiaSemana: DiasSemana.SegundaFeira,
    };
    const errorMessage = 'Error fetching transports';
    jest
      .spyOn(repository, 'findAll')
      .mockRejectedValueOnce(new Error(errorMessage));
    jest.spyOn(logger, 'error').mockImplementation(() => {});

    await expect(service.findAll(filters, 1, 10)).rejects.toThrow(
      `Internal server error while fetching transports`,
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching transports',
      expect.any(Error),
    );
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
