import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';
// import { CreateScheduleDto } from './dto/create-schedule.dto';
// import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll() {
    return await this.db.selectFrom('horarios').selectAll().execute();
  }

  async findById(id: string) {
    return await this.db
      .selectFrom('horarios')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .execute();
  }
  async findScheduleByHoursAndRoute(
    horaPartida: string,
    horaChegada: string,
    idRota: string,
  ) {
    return await this.db
      .selectFrom('horarios')
      .where('hora_partida', '=', horaPartida)
      .where('hora_chegada', '=', horaChegada)
      .where('id_rota', '=', idRota)
      .execute();
  }

  async create(schedule: Schedule) {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .insertInto('horarios')
        .values({
          id: schedule.id,
          hora_partida: schedule.horaPartida,
          hora_chegada: schedule.horaChegada,
          id_rota: schedule.idRota,
        })
        .returning([
          'id',
          'hora_partida',
          'hora_chegada',
          'id_rota',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();
    });
  }

  async update(id: string, schedule: Schedule) {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .updateTable('horarios')
        .set({
          ...(schedule.horaPartida && { hora_partida: schedule.horaPartida }),
          ...(schedule.horaChegada && { hora_chegada: schedule.horaChegada }),
          ...(schedule.idRota && { id_rota: schedule.idRota }),
          updated_at: sql`now()`,
        })
        .where('id', '=', id)
        .returning([
          'id',
          'hora_partida',
          'hora_chegada',
          'id_rota',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();
    });
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
}
