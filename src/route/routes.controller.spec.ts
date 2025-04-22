import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';
import { CreateRouteDTO } from './dto/create-route.dto';
describe('RoutesController', () => {
  let controller: RoutesController;

  const dto: CreateRouteDTO = {
    nome: 'Rota Teste',
    idCidadeOrigem: '1',
    idCidadeDestino: '2',
    distancia: 100,
    tempoEstimado: '2h',
    localOrigem: 'Local Teste',
    viaPrincipal: 'Via Teste',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [
        {
          provide: RoutesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoutesController>(RoutesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll method with filters', async () => {
    const result = [];
    const filters = {
      nome: 'Rota Teste',
      idCidadeOrigem: '1',
      idCidadeDestino: '2',
      distancia: 100,
      tempoEstimado: 120,
    };
    jest
      .spyOn(controller['routesService'], 'findAll')
      .mockResolvedValue(result);

    expect(
      await controller.findAll({
        page: 0,
        limit: 25,
        ...filters,
      }),
    ).toBe(result);
    expect(controller['routesService'].findAll).toHaveBeenCalledWith(
      filters,
      0,
      25,
    );
  });

  it('should call findOne method with id', async () => {
    const result = new Route(
      dto.nome,
      dto.idCidadeOrigem,
      dto.idCidadeDestino,
      dto.distancia,
      dto.tempoEstimado,
      'Local Teste',
    );
    const id = '1';
    jest
      .spyOn(controller['routesService'], 'findOne')
      .mockResolvedValue(result);

    expect(await controller.findOne(id)).toBe(result);
    expect(controller['routesService'].findOne).toHaveBeenCalledWith(id);
  });
  it('should call create method with dto', async () => {
    const result = new Route(
      dto.nome,
      dto.idCidadeOrigem,
      dto.idCidadeDestino,
      dto.distancia,
      dto.tempoEstimado,
      dto.localOrigem,
    );
    jest.spyOn(controller['routesService'], 'create').mockResolvedValue(result);

    expect(await controller.create(dto)).toBe(result);
    expect(controller['routesService'].create).toHaveBeenCalledWith(dto);
  });

  it('should call update method with id and dto', async () => {
    const id = '1';

    const result = new Route(
      dto.nome,
      dto.idCidadeOrigem,
      dto.idCidadeDestino,
      dto.distancia,
      dto.tempoEstimado,
      dto.localOrigem,
    );
    jest.spyOn(controller['routesService'], 'update').mockResolvedValue(result);

    expect(await controller.update(id, dto)).toBe(result);
    expect(controller['routesService'].update).toHaveBeenCalledWith(id, dto);
  });

  it('should call remove method with id', async () => {
    const id = '1';
    jest.spyOn(controller['routesService'], 'remove').mockResolvedValue();

    await controller.remove(id);
    expect(controller['routesService'].remove).toHaveBeenCalledWith(id);
  });
});
