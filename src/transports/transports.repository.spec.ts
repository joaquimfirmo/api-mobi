import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';
import { DatabaseException } from '../common/execptions/database.execption';
import { TransportsRepository } from './transports.repository';
import { DiasSemana } from '../types/enums/dias-semana.enum';

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
      diaSemana: DiasSemana.SegundaFeira,
      horaPartida: null,
      idCidadeDestino: null,
      idCidadeOrigem: null,
    };

    await repository.findAll(filters);
    expect(
      db.selectFrom('empresas_rotas_horarios').innerJoin,
    ).toHaveBeenCalled();

    expect(
      db.selectFrom('empresas_rotas_horarios').select,
    ).toHaveBeenCalledWith([
      'rotas.nome as rota',
      'empresas.nome_fantasia as empresa',
      'rotas.distancia as distancia_km',
      'rotas.tempo_estimado as duracao',
      'rotas.via_principal as via_principal',
      'veiculos.nome as veiculo',
      'horarios.dia_semana as dia_semana',
      'horarios.hora_partida as horario_partida',
      'horarios.hora_chegada as horario_chegada',
    ]);
  });

  it('should call findAll with filters', async () => {
    const spy = jest.spyOn(repository as any, 'generateWhereClause');
    const filters = {
      diaSemana: DiasSemana.SegundaFeira,
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

    expect(db.selectFrom('empresas_rotas_horarios').where).toHaveBeenCalled();
    expect(
      db.selectFrom('empresas_rotas_horarios').select,
    ).toHaveBeenCalledWith([
      'rotas.nome as rota',
      'empresas.nome_fantasia as empresa',
      'rotas.distancia as distancia_km',
      'rotas.tempo_estimado as duracao',
      'rotas.via_principal as via_principal',
      'veiculos.nome as veiculo',
      'horarios.dia_semana as dia_semana',
      'horarios.hora_partida as horario_partida',
      'horarios.hora_chegada as horario_chegada',
    ]);
  });

  it('should throw DatabaseException if findAll fails', async () => {
    db.selectFrom('empresas_rotas_horarios').innerJoin = jest
      .fn()
      .mockReturnValue(new Error('Database error'));

    await expect(
      repository.findAll({
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: null,
        idCidadeDestino: null,
        idCidadeOrigem: null,
      }),
    ).rejects.toThrow(DatabaseException);
    await expect(
      repository.findAll({
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: null,
        idCidadeDestino: null,
        idCidadeOrigem: null,
      }),
    ).rejects.toThrow('Não foi possível buscar transportes');
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
