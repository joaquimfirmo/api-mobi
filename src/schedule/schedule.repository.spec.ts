import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleRepository } from './schedule.repository';
import { Kysely } from 'kysely';
import { Database } from '../common/database/types';
import { ScheduleMapper } from './mapper/schedule.mapper';
import { DiasSemana } from '../types/enums/dias-semana.enum';

describe('ScheduleRepository', () => {
  let repository: ScheduleRepository;
  let db: Kysely<Database>;

  const mockSchedules = [
    {
      id: '1',
      dia_semana: DiasSemana.SegundaFeira,
      hora_partida: '08:00',
      hora_chegada: '10:00',
      id_rota: '123',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleRepository,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {
            selectFrom: jest.fn().mockReturnThis(),
            selectAll: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            transaction: jest.fn().mockReturnThis(),
            execute: jest.fn(),
            offset: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    repository = module.get<ScheduleRepository>(ScheduleRepository);
    db = module.get('DATABASE_CONNECTION');
  });
  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should call findAll method', async () => {
    jest.spyOn(repository as any, 'buildQuery');
    db.selectFrom('horarios').selectAll().execute = jest
      .fn()
      .mockResolvedValue(mockSchedules);

    const result = await repository.findAll({}, 0, 10);

    expect(db.selectFrom('horarios').selectAll().limit).toHaveBeenCalledWith(
      10,
    );
    expect(db.selectFrom('horarios').selectAll().offset).toHaveBeenCalledWith(
      0,
    );
    expect(db.selectFrom('horarios').selectAll().execute).toHaveBeenCalled();
    expect(repository['buildQuery']).toHaveBeenCalledWith({});
    expect(repository['buildQuery']).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      mockSchedules.map((schedule) => ScheduleMapper.toDomain(schedule)),
    );
  });

  it('should call findById method', async () => {
    const scheduleId = '1';
    db.selectFrom('horarios').selectAll().where('id', '=', scheduleId).execute =
      jest.fn().mockResolvedValue([mockSchedules[0]]);

    const result = await repository.findById(scheduleId);

    expect(db.selectFrom('horarios').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      scheduleId,
    );
    expect(db.selectFrom('horarios').selectAll().execute).toHaveBeenCalled();
    expect(result).toEqual(ScheduleMapper.toDomain(mockSchedules[0]));
  });

  it('should call create method', async () => {
    const schedule = {
      dia_semana: DiasSemana.SegundaFeira,
      hora_partida: '08:00:00',
      hora_chegada: '10:00:00',
      id_rota: '123',
      id: '1',
      created_at: new Date(),
      updated_at: null,
    };

    db.transaction = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        id: schedule.id,
        dia_semana: schedule.dia_semana,
        hora_partida: schedule.hora_partida,
        hora_chegada: schedule.hora_chegada,
        id_rota: schedule.id_rota,
        created_at: schedule.created_at,
        updated_at: schedule.updated_at,
      }),
    });

    const result = await repository.create(
      ScheduleMapper.toPersistence(schedule),
    );

    expect(db.transaction).toHaveBeenCalled();
    expect(result).toEqual(ScheduleMapper.toDomain(schedule));
  });

  it('should call update method', async () => {
    const scheduleId = '1';
    const updatedSchedule = {
      dia_semana: DiasSemana.TercaFeira,
      hora_partida: '09:00:00',
      hora_chegada: '11:00:00',
      id_rota: '456',
      id: scheduleId,
      created_at: new Date(),
      updated_at: new Date(),
    };
    db.transaction = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        id: updatedSchedule.id,
        dia_semana: updatedSchedule.dia_semana,
        hora_partida: updatedSchedule.hora_partida,
        hora_chegada: updatedSchedule.hora_chegada,
        id_rota: updatedSchedule.id_rota,
        created_at: updatedSchedule.created_at,
        updated_at: updatedSchedule.updated_at,
      }),
    });

    const result = await repository.update(
      scheduleId,
      ScheduleMapper.toPersistence(updatedSchedule),
    );
    expect(db.transaction).toHaveBeenCalled();
    expect(result).toEqual(ScheduleMapper.toDomain(updatedSchedule));
  });

  it('should call delete method', async () => {
    const scheduleId = '1';
    db.transaction = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({}),
    });

    await repository.delete(scheduleId);

    expect(db.transaction).toHaveBeenCalled();
  });

  it('should call findScheduleByHoursAndRoute method', async () => {
    const criteria = {
      dia_semana: DiasSemana.SegundaFeira,
      hora_partida: '08:00',
      id_rota: '123',
    };

    db.selectFrom('horarios').selectAll().where = jest.fn().mockReturnThis();
    db.selectFrom('horarios').selectAll().execute = jest
      .fn()
      .mockResolvedValue([mockSchedules[0]]);

    const result = await repository.findScheduleByHoursAndRoute(criteria);

    expect(db.selectFrom('horarios').selectAll().where).toHaveBeenCalled();
    expect(db.selectFrom('horarios').selectAll().execute).toHaveBeenCalled();
    expect(result).toEqual(ScheduleMapper.toDomain(mockSchedules[0]));
  });

  it('should return null if no schedule found in findById', async () => {
    const scheduleId = '999';
    db.selectFrom('horarios').selectAll().where('id', '=', scheduleId).execute =
      jest.fn().mockResolvedValue([]);

    const result = await repository.findById(scheduleId);

    expect(result).toBeNull();
  });

  it('should return null if no schedule found in findScheduleByHoursAndRoute', async () => {
    const criteria = {
      dia_semana: DiasSemana.SegundaFeira,
      hora_partida: '08:00',
      id_rota: '123',
    };

    db.selectFrom('horarios').selectAll().where = jest.fn().mockReturnThis();
    db.selectFrom('horarios').selectAll().execute = jest
      .fn()
      .mockResolvedValue([]);

    const result = await repository.findScheduleByHoursAndRoute(criteria);

    expect(result).toBeNull();
  });

  it('should call buildQuery method', () => {
    const criteria = { dia_semana: DiasSemana.SegundaFeira };
    const query = repository['buildQuery'](criteria);
    expect(query).toBeDefined();
    expect(query.where).toHaveBeenCalledWith(
      'dia_semana',
      '=',
      criteria.dia_semana,
    );
  });
  it('should call buildQuery method with empty criteria', () => {
    const criteria = {};
    const query = repository['buildQuery'](criteria);
    expect(query).toBeDefined();
    expect(query.where).not.toHaveBeenCalled();
  });
  it('should call buildQuery method with multiple criteria', () => {
    const criteria = {
      dia_semana: DiasSemana.SegundaFeira,
      hora_partida: '08:00',
      hora_chegada: '10:00',
    };
    const query = repository['buildQuery'](criteria);
    expect(query).toBeDefined();
    expect(query.where).toHaveBeenCalledWith(
      'dia_semana',
      '=',
      criteria.dia_semana,
    );
    expect(query.where).toHaveBeenCalledWith(
      'hora_partida',
      '=',
      criteria.hora_partida,
    );
    expect(query.where).toHaveBeenCalledWith(
      'hora_chegada',
      '=',
      criteria.hora_chegada,
    );
  });
});
