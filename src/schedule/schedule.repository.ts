import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database, Schedules } from 'src/common/database/types';
import { Schedule } from './entities/schedule.entity';
import { ScheduleMapper } from './mapper/schedule.mapper';

@Injectable()
export class ScheduleRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll(
    criteria: Partial<Schedules>,
    page: number,
    limit: number,
  ): Promise<Schedule[]> {
    const query = this.buildQuery(criteria);
    const offset = page * limit;
    const schedules = await query
      .selectAll()
      .limit(limit)
      .offset(offset)
      .execute();

    return schedules.map((schedule) => {
      return ScheduleMapper.toDomain(schedule);
    });
  }

  async findById(id: string): Promise<Schedule | null> {
    const [result] = await this.db
      .selectFrom('horarios')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .execute();

    if (result?.created_at) {
      return ScheduleMapper.toDomain(result);
    }

    return null;
  }
  async findScheduleByHoursAndRoute(
    criteria: Partial<Schedules>,
  ): Promise<Schedule | null> {
    const query = this.buildQuery(criteria);
    const [result] = await query.selectAll().execute();
    if (result?.created_at) {
      return ScheduleMapper.toDomain(result);
    }
    return null;
  }

  async create(schedule: Partial<Schedules>): Promise<Schedule> {
    const record = await this.db.transaction().execute(async (trx) => {
      return await trx
        .insertInto('horarios')
        .values({
          id: schedule.id,
          dia_semana: schedule.dia_semana,
          hora_partida: schedule.hora_partida,
          hora_chegada: schedule.hora_chegada,
          id_rota: schedule.id_rota,
        })
        .returning([
          'id',
          'dia_semana',
          'hora_partida',
          'hora_chegada',
          'id_rota',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();
    });
    return ScheduleMapper.toDomain(record);
  }

  async update(id: string, schedule: Partial<Schedules>): Promise<Schedule> {
    const result = await this.db.transaction().execute(async (trx) => {
      return await trx
        .updateTable('horarios')
        .set({
          ...{ dia_semana: schedule.dia_semana },
          ...{ hora_partida: schedule.hora_partida },
          ...{ hora_chegada: schedule.hora_chegada },
          ...{ id_rota: schedule.id_rota },
          updated_at: sql`now()`,
        })
        .where('id', '=', id)
        .returning([
          'id',
          'dia_semana',
          'hora_partida',
          'hora_chegada',
          'id_rota',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();
    });

    return ScheduleMapper.toDomain(result);
  }

  async delete(id: string) {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .deleteFrom('horarios')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirstOrThrow();
    });
  }

  private buildQuery(criteria: Partial<Schedules>) {
    let query = this.db.selectFrom('horarios');

    if (criteria.dia_semana) {
      query = query.where('dia_semana', '=', criteria.dia_semana);
    }

    if (criteria.hora_partida) {
      query = query.where('hora_partida', '=', criteria.hora_partida);
    }

    if (criteria.hora_chegada) {
      query = query.where('hora_chegada', '=', criteria.hora_chegada);
    }

    if (criteria.id_rota) {
      query = query.where('id_rota', '=', criteria.id_rota);
    }

    return query;
  }
}
