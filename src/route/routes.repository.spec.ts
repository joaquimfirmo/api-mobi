import { Test, TestingModule } from '@nestjs/testing';
import { RoutesRepository } from './routes.repository';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';

describe('RoutesRepository', () => {
  let repository: RoutesRepository;
  let db: Kysely<Database>;

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
    await repository.findAll();
    expect(db.selectFrom('rotas').selectAll().execute).toHaveBeenCalled();
  });

  it('should call findById method', async () => {
    await repository.findById('1');
    expect(db.selectFrom('rotas').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      '1',
    );
    expect(db.selectFrom('rotas').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('rotas').selectAll().execute).toHaveBeenCalled();
  });

  it('should call create method', async () => {
    await repository.create({
      name: 'Nome',
      idOriginCity: 'idCidadeOrigem',
      idDestinationCity: 'idCidadeDestino',
      distance: 100,
      estimatedTime: '01:00',
      originLocation: 'localOrigem',
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call update method', async () => {
    await repository.update('1', {
      idCidadeOrigem: 'Cidade Origem',
    });
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call delete method', async () => {
    await repository.delete('1');
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it.skip('should call findAllTransportsByCityId method', async () => {
    await repository.findAllTransportsByCityId('1');
    expect(db.selectFrom('transportes').selectAll().where).toHaveBeenCalledWith(
      'id_cidade',
      '=',
      '1',
    );

    expect(db.selectFrom('transportes').selectAll().execute).toHaveBeenCalled();
  });

  it.skip('should call findByCityId method with the correct filters ', async () => {
    const spy = jest.spyOn(repository, 'generateWhereClause');

    await repository.findByCityId('1', 0, 20, {
      day: '1',
      hour: '12:00',
      city_destination: '1',
    });

    expect(spy).toHaveBeenCalledWith('1', '12:00', '1');
    expect(
      db.selectFrom('transportes').selectAll().innerJoin,
    ).toHaveBeenCalledWith('veiculos', 'veiculos.id', 'transportes.id_veiculo');
    expect(
      db.selectFrom('transportes').selectAll().innerJoin,
    ).toHaveBeenCalledWith('empresas', 'empresas.id', 'transportes.id_empresa');
    expect(db.selectFrom('transportes').selectAll().where).toHaveBeenCalledWith(
      'transportes.id_cidade',
      '=',
      '1',
    );
    expect(db.selectFrom('transportes').selectAll().limit).toHaveBeenCalledWith(
      20,
    );
    expect(
      db.selectFrom('transportes').selectAll().offset,
    ).toHaveBeenCalledWith(0);
    expect(db.selectFrom('transportes').compile).toHaveBeenCalled();
  });

  it.skip('should call findByCityId method without filters', async () => {
    const spy = jest.spyOn(repository, 'generateWhereClause');

    await repository.findByCityId('1', 0, 20, {});

    expect(spy).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(
      db.selectFrom('transportes').selectAll().innerJoin,
    ).toHaveBeenCalledWith('veiculos', 'veiculos.id', 'transportes.id_veiculo');
    expect(
      db.selectFrom('transportes').selectAll().innerJoin,
    ).toHaveBeenCalledWith('empresas', 'empresas.id', 'transportes.id_empresa');
    expect(db.selectFrom('transportes').selectAll().where).toHaveBeenCalledWith(
      'transportes.id_cidade',
      '=',
      '1',
    );
    expect(db.selectFrom('transportes').selectAll().limit).toHaveBeenCalledWith(
      20,
    );
    expect(
      db.selectFrom('transportes').selectAll().offset,
    ).toHaveBeenCalledWith(0);
    expect(db.selectFrom('transportes').compile).toHaveBeenCalled();
  });
});
