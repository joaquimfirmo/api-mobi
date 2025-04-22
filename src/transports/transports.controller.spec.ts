import { Test, TestingModule } from '@nestjs/testing';
import { TransportsController } from './transports.controller';
import { TransportsService } from './transports.service';

describe('TransportsController', () => {
  let controller: TransportsController;
  let service: TransportsService;

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
      controllers: [TransportsController],
      providers: [
        {
          provide: TransportsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransportsController>(TransportsController);
    service = module.get<TransportsService>(TransportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll method from service', async () => {
    const filters = {
      page: 1,
      limit: 10,
      diaSemana: null,
      horaPartida: null,
      idCidadeOrigem: null,
      idCidadeDestino: null,
    };
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockTransports);
    expect(await controller.findAll(filters)).toBe(mockTransports);
    expect(service.findAll).toHaveBeenCalledTimes(1);

    const { page, limit, ...rest } = filters;
    expect(service.findAll).toHaveBeenCalledWith(rest, page, limit);
  });
});
