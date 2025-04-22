import { Schedule } from '../entities/schedule.entity';
import { Schedules as ScheduleRecord } from '../../common/database/types';

export class ScheduleMapper {
  static toDomain(scheduleRecord: ScheduleRecord): Schedule {
    return new Schedule(
      scheduleRecord.dia_semana,
      scheduleRecord.hora_partida,
      scheduleRecord.hora_chegada,
      scheduleRecord.id_rota,
      scheduleRecord.id,
      scheduleRecord.created_at,
      scheduleRecord.updated_at,
    );
  }

  static toPersistence(schedule: Partial<Schedule>): ScheduleRecord {
    return {
      id: schedule.id,
      dia_semana: schedule.diaSemana,
      hora_partida: schedule.horaPartida,
      hora_chegada: schedule.horaChegada,
      id_rota: schedule.idRota,
      created_at: schedule.createdAt ? new Date(schedule.createdAt) : null,
      updated_at: schedule.updatedAt ? new Date(schedule.updatedAt) : null,
    };
  }
}
