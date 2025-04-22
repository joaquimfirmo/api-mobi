import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleRepository } from './schedule.repository';
import { Schedule } from './entities/schedule.entity';
import { ScheduleMapper } from './mapper/schedule.mapper';

type criteriaSchedules = Partial<Schedule>;

@Injectable()
export class ScheduleService {
  constructor(
    private readonly logger: Logger,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    await this.ensureScheduleDoesNotExist(createScheduleDto);
    const schedule = new Schedule(
      createScheduleDto.diaSemana,
      createScheduleDto.horaPartida,
      createScheduleDto.horaChegada,
      createScheduleDto.idRota,
    );

    try {
      this.logger.log(`Criando horário: ${JSON.stringify(schedule)}`);
      return await this.scheduleRepository.create(
        ScheduleMapper.toPersistence(schedule),
      );
    } catch (error) {
      this.logger.error(
        `Erro ao criar horário: ${JSON.stringify(createScheduleDto)}`,
        error,
      );
      throw new InternalServerErrorException(
        'Erro interno ao tentar salvar o horário',
      );
    }
  }

  async findAll(filters: criteriaSchedules, page: number, limit: number) {
    this.logger.log(
      `Buscando horários com os filtros: ${JSON.stringify(filters)}`,
    );
    try {
      return await this.scheduleRepository.findAll(
        ScheduleMapper.toPersistence(filters),
        page,
        limit,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao buscar horários com os filtros: ${JSON.stringify(filters)}`,
        error,
      );
      throw new InternalServerErrorException('Erro ao buscar os horários');
    }
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule: Schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      this.logger.warn(`Horário com o ID:${id} informado não foi encontrado`);
      throw new NotFoundException(
        `Horário com o ID:${id} informado não foi encontrado`,
      );
    }
    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    this.validateUpdatePayload(updateScheduleDto);

    const scheduleExists = await this.checkScheduleExists({ id });

    if (!scheduleExists) {
      this.logger.warn(`Horário com o ID:${id} informado não foi encontrado`);
      throw new NotFoundException(
        `Horário com o ID:${id} informado para atualização não foi encontrado`,
      );
    }

    try {
      this.logger.log(
        `Atualizando horário: ${JSON.stringify(updateScheduleDto)}`,
      );
      return await this.scheduleRepository.update(
        id,
        ScheduleMapper.toPersistence(updateScheduleDto),
      );
    } catch (error) {
      if ((error as any).code === '23505') {
        this.logger.error(
          `Os novos dados informados formam um horário duplicado: ${JSON.stringify(updateScheduleDto)}`,
        );
        throw new BadRequestException(
          `Os novos dados informados já existem para outro horário`,
        );
      }
      this.logger.error(`Erro ao atualizar horário com ID:${id}`, error);
      throw new InternalServerErrorException('Erro ao atualizar o horário');
    }
  }

  async remove(id: string) {
    const scheduleExists = await this.checkScheduleExists({ id });
    if (!scheduleExists) {
      this.logger.warn(
        `Tentativa de remover horário com ID:${id}, mas ele não foi encontrado`,
      );
      throw new NotFoundException(
        `Horário com o ID:${id} informado para remoção não foi encontrado`,
      );
    }

    this.logger.log(`Removendo horário com ID:${id}`);
    await this.scheduleRepository.delete(id);
    return;
  }

  private async checkScheduleExists(
    criteria: criteriaSchedules,
  ): Promise<boolean> {
    if (!criteria.id) {
      const scheduleExists =
        await this.scheduleRepository.findScheduleByHoursAndRoute(
          ScheduleMapper.toPersistence(criteria),
        );

      return !!scheduleExists;
    }

    const schedule = await this.scheduleRepository.findById(criteria.id);
    return !!schedule;
  }

  private async ensureScheduleDoesNotExist(
    createScheduleDto: CreateScheduleDto,
  ): Promise<void> {
    const scheduleExists = await this.checkScheduleExists({
      diaSemana: createScheduleDto.diaSemana,
      horaPartida: createScheduleDto.horaPartida,
      horaChegada: createScheduleDto.horaChegada,
      idRota: createScheduleDto.idRota,
    });

    if (scheduleExists) {
      this.logger.error(
        `Já existe um horário com a rota e horários informados: ${JSON.stringify(createScheduleDto)}`,
      );
      throw new BadRequestException(
        `O horário informado já existe para a rota informada`,
      );
    }
  }

  private validateUpdatePayload(updateScheduleDto: UpdateScheduleDto): void {
    if (Object.keys(updateScheduleDto).length === 0) {
      this.logger.warn(`Nenhum dado para atualização foi informado`);
      throw new BadRequestException(
        `Nenhum dado para atualização foi informado`,
      );
    }
  }
}
