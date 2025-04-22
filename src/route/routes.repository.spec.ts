import { Test, TestingModule } from '@nestjs/testing';
import { RoutesRepository } from './routes.repository';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';
import { RouteMapper } from './mapper/route.mapper';

describe('RoutesRepository', () => {
  let repository: RoutesRepository;
  let db: Kysely<Database>;

  const mockRoutes = [
    {
      id: '1',
      nome: 'Rota 1',
      id_cidade_origem: 'Cidade A',
      id_cidade_destino: 'Cidade B',
      distancia: 100,
      tempo_estimado: '01:00',
      local: 'Local A',
      via_principal: 'Via Principal A',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesRepository,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {
            selectFrom: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            selectAll: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            transaction: jest.fn().mockReturnThis(),
            compile: jest.fn().mockReturnThis(),
            executeQuery: jest.fn().mockReturnThis(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<RoutesRepository>(RoutesRepository);
    db = module.get('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should call findAll method', async () => {
    jest.spyOn(repository as any, 'buildQuery');

    db.selectFrom('rotas').selectAll().execute = jest
      .fn()
      .mockResolvedValue(mockRoutes);

    const result = await repository.findAll({}, 0, 10);
    expect(db.selectFrom('rotas').selectAll().execute).toHaveBeenCalled();
    expect(db.selectFrom('rotas').selectAll().limit).toHaveBeenCalledWith(10);
    expect(db.selectFrom('rotas').selectAll().offset).toHaveBeenCalledWith(0);
    expect(repository['buildQuery']).toHaveBeenCalledWith({});
    expect(result).toEqual(
      mockRoutes.map((route) => RouteMapper.toDomain(route)),
    );
  });

  it('should call findById method', async () => {
    db.selectFrom('rotas').selectAll().where('id', '=', '1').execute = jest
      .fn()
      .mockResolvedValue([mockRoutes[0]]);

    const result = await repository.findById('1');
    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      '1',
    );
    expect(db.selectFrom('rotas').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('rotas').selectAll().execute).toHaveBeenCalled();
    expect(result).toEqual(RouteMapper.toDomain(mockRoutes[0]));
  });

  it('should call findRouteByCities method', async () => {
    const cityId1 = 'city-id-1';
    const cityId2 = 'city-id-2';

    db
      .selectFrom('rotas')
      .selectAll()
      .where('id_cidade_origem', '=', cityId1)
      .where('id_cidade_destino', '=', cityId2).execute = jest
      .fn()
      .mockResolvedValue([mockRoutes[0]]);

    const result = await repository.findRouteByCities(cityId1, cityId2);

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'id_cidade_origem',
      '=',
      cityId1,
    );
    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'id_cidade_destino',
      '=',
      cityId2,
    );
    expect(db.selectFrom('rotas').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('rotas').selectAll().execute).toHaveBeenCalled();
    expect(result).toEqual(RouteMapper.toDomain(mockRoutes[0]));
  });

  it('shoud call findRouteByName method', async () => {
    const routeName = 'City A to City B';

    db.selectFrom('rotas').selectAll().where('nome', '=', routeName).execute =
      jest.fn().mockResolvedValue([mockRoutes[0]]);

    const result = await repository.findRouteByName(routeName);

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'nome',
      '=',
      routeName,
    );
    expect(db.selectFrom('rotas').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('rotas').selectAll().execute).toHaveBeenCalled();
    expect(result).toEqual(RouteMapper.toDomain(mockRoutes[0]));
  });

  it('should call create method', async () => {
    const route = {
      nome: 'City 1 to City 2',
      idCidadeOrigem: 'fake-id-city-1',
      idCidadeDestino: 'fake-id-city-2',
      distancia: 60,
      tempoEstimado: '1 hours',
      localOrigem: 'City 1',
      viaPrincipal: 'Main Road',
    };

    db.transaction().execute = jest.fn().mockResolvedValue([
      {
        nome: route.nome,
        id_cidade_origem: route.idCidadeOrigem,
        id_cidade_destino: route.idCidadeDestino,
        distancia: route.distancia,
        tempo_estimado: route.tempoEstimado,
        local: route.localOrigem,
        via_principal: route.viaPrincipal,
        id: '1',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await repository.create(RouteMapper.toPersistence(route));

    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
    expect(db.transaction().execute).toHaveBeenCalledTimes(1);
  });

  it('should call update method', async () => {
    const routeForUpdate = {
      nome: 'City 1 to City 2',
      idCidadeOrigem: 'fake-id-city-1',
      idCidadeDestino: 'fake-id-city-2',
      distancia: 60,
      tempoEstimado: '1 hours',
      localOrigem: 'City 1',
      viaPrincipal: 'Main Road',
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const record = {
      id: routeForUpdate.id,
      nome: routeForUpdate.nome,
      id_cidade_origem: routeForUpdate.idCidadeOrigem,
      id_cidade_destino: routeForUpdate.idCidadeDestino,
      distancia: routeForUpdate.distancia,
      tempo_estimado: routeForUpdate.tempoEstimado,
      local: routeForUpdate.localOrigem,
      via_principal: routeForUpdate.viaPrincipal,
      created_at: routeForUpdate.createdAt,
      updated_at: routeForUpdate.updatedAt,
    };

    db.transaction = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue(record),
    });

    const result = await repository.update(
      '1',
      RouteMapper.toPersistence(routeForUpdate),
    );

    expect(result).toEqual(RouteMapper.toDomain(record));
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call delete method', async () => {
    await repository.delete('1');
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('buildQuery should be called with the correct parameters', () => {
    const criteria = {
      nome: 'Rota 1',
      id_cidade_origem: 'Cidade A',
      id_cidade_destino: 'Cidade B',
      distancia: 100,
      tempo_estimado: '01:00',
      local: 'Local A',
      via_principal: 'Via Principal A',
    };

    repository['buildQuery'](criteria);

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'nome',
      '=',
      criteria.nome,
    );

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'id_cidade_origem',
      '=',
      criteria.id_cidade_origem,
    );
    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'id_cidade_destino',
      '=',
      criteria.id_cidade_destino,
    );

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'distancia',
      '=',
      criteria.distancia,
    );

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'tempo_estimado',
      '=',
      criteria.tempo_estimado,
    );

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'local',
      '=',
      criteria.local,
    );

    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'via_principal',
      '=',
      criteria.via_principal,
    );
  });
});
