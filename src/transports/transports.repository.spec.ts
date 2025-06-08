import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';
import { DatabaseException } from '../common/execptions/database.execption';
import { TransportsRepository } from './transports.repository';
import { DiasSemana } from '../types/enums/dias-semana.enum';

jest.mock('../common/utils/money.utils', () => ({
  convertMoney: jest.fn((value) => value),
}));

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
            executeTakeFirst: jest.fn().mockReturnThis(),
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
      'empresas_rotas_horarios.preco_passagem as preco',
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
      'empresas_rotas_horarios.preco_passagem as preco',
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

  it('should call exists method', async () => {
    const idEmpresa = 'empresa-id';
    const idRota = 'rota-id';
    const idHorario = 'horario-id';
    const idVeiculo = 'veiculo-id';
    await repository.exists(idEmpresa, idRota, idHorario, idVeiculo);
    expect(
      db
        .selectFrom('empresas_rotas_horarios')
        .select('id')
        .where('id_empresa', '=', idEmpresa)
        .where('id_rota', '=', idRota)
        .where('id_horario', '=', idHorario)
        .where('id_veiculo', '=', idVeiculo),
    );

    expect(
      db.selectFrom('empresas_rotas_horarios').select('id').executeTakeFirst,
    ).toHaveBeenCalled();
  });

  it('should throw DatabaseException if exists fails', async () => {
    db.selectFrom('empresas_rotas_horarios').select = jest
      .fn()
      .mockReturnValue(new Error('Database error'));

    await expect(
      repository.exists('empresa-id', 'rota-id', 'horario-id', 'veiculo-id'),
    ).rejects.toThrow(DatabaseException);
    await expect(
      repository.exists('empresa-id', 'rota-id', 'horario-id', 'veiculo-id'),
    ).rejects.toThrow('Não foi possível verificar a existência do transporte');
  });

  it('should call create method', async () => {
    const transport = {
      id: '1',
      id_empresa: 'empresa-id',
      id_rota: 'rota-id',
      id_horario: 'horario-id',
      id_veiculo: 'veiculo-id',
      preco_passagem: 100,
    };

    db.transaction = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue(transport),
    });

    await repository.create(transport);
    expect(db.transaction).toHaveBeenCalled();
  });

  it('should throw DatabaseException if create fails', async () => {
    db.transaction = jest.fn().mockReturnValue({
      execute: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    await expect(repository.create({})).rejects.toThrow(DatabaseException);
    await expect(repository.create({})).rejects.toThrow(
      'Não foi possível criar o transporte',
    );
  });
});
