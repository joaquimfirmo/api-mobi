import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';
import { TransportsRepository } from './transports.repository';

describe('TransportsRepository', () => {
  let repository: TransportsRepository;
  let db: Kysely<Database>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportsRepository,
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

    repository = module.get<TransportsRepository>(TransportsRepository);
    db = module.get('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should call findAll method', async () => {
    const filters = {
      diaSemana: null,
      horaPartida: null,
      idCidadeDestino: null,
      idCidadeOrigem: null,
    };

    await repository.findAll(filters);
    expect(db.selectFrom('empresas_rotas').innerJoin).toHaveBeenCalled();

    expect(db.selectFrom('empresas_rotas').select).toHaveBeenCalledWith([
      'rotas.nome as rota',
      'empresas.nome_fantasia as empresa',
      'rotas.distancia as distancia_km',
      'rotas.tempo_estimado as duracao',
      'veiculos.nome as veiculo',
      'horarios.hora_partida as horario_partida',
      'horarios.hora_chegada as horario_chegada',
    ]);
  });

  it('should call findAll with filters', async () => {
    const spy = jest.spyOn(repository as any, 'generateWhereClause');
    const filters = {
      diaSemana: 'Segunda-feira',
      horaPartida: '08:00',
      idCidadeDestino: '1',
      idCidadeOrigem: '2',
    };

    await repository.findAll(filters);
    expect(spy).toHaveBeenCalledWith(
      filters.diaSemana,
      filters.horaPartida,
      filters.idCidadeOrigem,
      filters.idCidadeDestino,
    );

    expect(db.selectFrom('empresas_rotas').where).toHaveBeenCalled();
    expect(db.selectFrom('empresas_rotas').select).toHaveBeenCalledWith([
      'rotas.nome as rota',
      'empresas.nome_fantasia as empresa',
      'rotas.distancia as distancia_km',
      'rotas.tempo_estimado as duracao',
      'veiculos.nome as veiculo',
      'horarios.hora_partida as horario_partida',
      'horarios.hora_chegada as horario_chegada',
    ]);
  });

  it('should call generateWhereClause method', () => {
    const filters = {
      diaSemana: 'Segunda-feira',
      horaPartida: '08:00',
      idCidadeDestino: '1',
      idCidadeOrigem: '2',
    };

    const whereClause = repository['generateWhereClause'](
      filters.diaSemana,
      filters.horaPartida,
      filters.idCidadeOrigem,
      filters.idCidadeDestino,
    );

    expect(whereClause).toBeDefined();
  });
});
