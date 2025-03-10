import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleRepository } from './schedule.repository';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly logger: Logger,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    const schedule = new Schedule(
      createScheduleDto.horaPartida,
      createScheduleDto.horaChegada,
      createScheduleDto.idRota,
    );

    const scheduleExists =
      await this.scheduleRepository.findScheduleByHoursAndRoute(
        schedule.horaPartida,
        schedule.horaChegada,
        schedule.idRota,
      );

    if (scheduleExists.length > 0) {
      this.logger.error(
        `Já existe um horário com a rota e horários informados: ${JSON.stringify(
          scheduleExists,
        )}`,
      );
      throw new BadRequestException(
        `Já existe um horário com a rota e horários informados`,
      );
    }
    this.logger.log(`Criando horário: ${JSON.stringify(schedule)}`);
    return await this.scheduleRepository.create(schedule);
  }

  async findAll() {
    const schedules = await this.scheduleRepository.findAll();
    return schedules.map(
      (schedule) =>
        new Schedule(
          schedule.hora_partida,
          schedule.hora_chegada,
          schedule.id_rota,
          schedule.id,
          schedule.created_at,
          schedule.updated_at,
        ),
    );
  }

  async findOne(id: string): Promise<Schedule> {
    const [schedule] = await this.scheduleRepository.findById(id);
    if (!schedule) {
      this.logger.warn(`Horário com o ID:${id} informado não foi encontrado`);
      throw new NotFoundException(
        `Horário com o ID:${id} informado não foi encontrado`,
      );
    }
    return new Schedule(
      schedule.hora_partida,
      schedule.hora_chegada,
      schedule.id_rota,
      schedule.id,
      schedule.created_at,
      schedule.updated_at,
    );
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    if (Object.keys(updateScheduleDto).length === 0) {
      this.logger.error(`Nenhum dado para atualização foi informado`);
      throw new BadRequestException(
        `Nenhum dado para atualização foi informado`,
      );
    }
    const [scheduleExists] = await this.scheduleRepository.findById(id);
    if (!scheduleExists) {
      this.logger.error(`Horário com o ID:${id} informado não foi encontrado`);
      throw new NotFoundException(
        `Horário com o ID:${id} informado para atualização não foi encontrado`,
      );
    }

    const schedule = new Schedule(
      updateScheduleDto.horaPartida,
      updateScheduleDto.horaChegada,
      updateScheduleDto.idRota,
    );

    this.logger.log(`Atualizando horário: ${JSON.stringify(schedule)}`);
    return this.scheduleRepository.update(id, schedule);
  }

  async remove(id: string) {
    const [scheduleExists] = await this.scheduleRepository.findById(id);
    if (!scheduleExists) {
      this.logger.error(`Horário com o ID:${id} informado não foi encontrado`);
      throw new NotFoundException(
        `Horário com o ID:${id} informado para remoção não foi encontrado`,
      );
    }

    this.logger.log(`Removendo horário com ID:${id}`);
    await this.scheduleRepository.delete(id);
    return;
  }
}
