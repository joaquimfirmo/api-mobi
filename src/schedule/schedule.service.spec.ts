import { Test, TestingModule } from '@nestjs/testing';
import {
  Logger,
  Scope,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleMapper } from './mapper/schedule.mapper';
import { DiasSemana } from '../types/enums/dias-semana.enum';
import { Schedule } from './entities/schedule.entity';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let repository: ScheduleRepository;
  let logger: Logger;

  const mockCreateScheduleDto = {
    diaSemana: DiasSemana.SegundaFeira,
    horaPartida: '08:00:00',
    horaChegada: '10:00:00',
    idRota: '123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: Logger,
          scope: Scope.TRANSIENT,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: ScheduleRepository,
          useValue: {
            findScheduleByHoursAndRoute: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    repository = module.get<ScheduleRepository>(ScheduleRepository);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new schedule successfully', async () => {
      const data = new Date();
      const ensureScheduleDoesNotExistSpy = jest
        .spyOn(service as any, 'ensureScheduleDoesNotExist')
        .mockResolvedValueOnce(undefined);

      jest.spyOn(repository, 'create').mockResolvedValueOnce(
        ScheduleMapper.toDomain({
          id: 'fake-id',
          dia_semana: mockCreateScheduleDto.diaSemana,
          hora_partida: mockCreateScheduleDto.horaPartida,
          hora_chegada: mockCreateScheduleDto.horaChegada,
          id_rota: mockCreateScheduleDto.idRota,
          created_at: data,
          updated_at: new Date(),
        }),
      );

      const result = await service.create(mockCreateScheduleDto);

      expect(ensureScheduleDoesNotExistSpy).toHaveBeenCalledWith(
        mockCreateScheduleDto,
      );
      expect(repository.create).toHaveBeenCalledWith({
        id: expect.any(String),
        dia_semana: mockCreateScheduleDto.diaSemana,
        hora_partida: mockCreateScheduleDto.horaPartida,
        hora_chegada: mockCreateScheduleDto.horaChegada,
        id_rota: mockCreateScheduleDto.idRota,
        created_at: expect.any(Date),
        updated_at: null,
      });
      expect(result).toEqual({
        id: expect.any(String),
        diaSemana: mockCreateScheduleDto.diaSemana,
        horaPartida: mockCreateScheduleDto.horaPartida,
        horaChegada: mockCreateScheduleDto.horaChegada,
        idRota: mockCreateScheduleDto.idRota,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw BadRequestException if schedule already exists', async () => {
      jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(true);
      await expect(service.create(mockCreateScheduleDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Já existe um horário com a rota e horários informados: ${JSON.stringify(mockCreateScheduleDto)}`,
      );
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const errorMessage = 'Error creating schedule';

      jest
        .spyOn(service as any, 'ensureScheduleDoesNotExist')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(repository, 'create')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(service.create(mockCreateScheduleDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao criar horário: ${JSON.stringify(mockCreateScheduleDto)}`,
        expect.any(Error),
      );
    });
  });

  describe('remove', () => {
    it('should remove a schedule successfully', async () => {
      const id = 'fake-id';
      const checkScheduleExistsSpy = jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(true);

      await service.remove(id);

      expect(checkScheduleExistsSpy).toHaveBeenCalledWith({ id });
      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if schedule does not exist', async () => {
      const id = 'fake-id';
      jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(false);

      await expect(service.remove(id)).rejects.toThrow(
        `Horário com o ID:${id} informado para remoção não foi encontrado`,
      );

      expect(logger.warn).toHaveBeenCalledWith(
        `Tentativa de remover horário com ID:${id}, mas ele não foi encontrado`,
      );
    });
  });

  describe('findAll', () => {
    it('should find all schedules with filters', async () => {
      const filters = {
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: '08:00:00',
        horaChegada: '10:00:00',
        idRota: '123',
      };
      const page = 1;
      const limit = 10;
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([
        ScheduleMapper.toDomain({
          id: 'fake-id',
          dia_semana: mockCreateScheduleDto.diaSemana,
          hora_partida: mockCreateScheduleDto.horaPartida,
          hora_chegada: mockCreateScheduleDto.horaChegada,
          id_rota: mockCreateScheduleDto.idRota,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ]);
      const result = await service.findAll(filters, page, limit);
      expect(repository.findAll).toHaveBeenCalledWith(
        ScheduleMapper.toPersistence(filters),
        page,
        limit,
      );
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledWith(
        `Buscando horários com os filtros: ${JSON.stringify(filters)}`,
      );
      expect(result).toEqual([
        {
          id: expect.any(String),
          diaSemana: mockCreateScheduleDto.diaSemana,
          horaPartida: mockCreateScheduleDto.horaPartida,
          horaChegada: mockCreateScheduleDto.horaChegada,
          idRota: mockCreateScheduleDto.idRota,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const filters = {
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: '08:00:00',
        horaChegada: '10:00:00',
        idRota: '123',
      };
      const page = 1;
      const limit = 10;
      const errorMessage = 'Error fetching schedules';
      jest
        .spyOn(repository, 'findAll')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(service.findAll(filters, page, limit)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao buscar horários com os filtros: ${JSON.stringify(filters)}`,
        expect.any(Error),
      );
    });
  });

  describe('findOne', () => {
    it('should find a schedule by ID', async () => {
      const id = 'fake-id';
      const schedule = new Schedule(
        DiasSemana.SegundaFeira,
        '08:00:00',
        '10:00:00',
        '123',
      );
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(schedule);
      const result = await service.findOne(id);
      expect(repository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(schedule);
    });

    it('should throw NotFoundException if schedule does not exist', async () => {
      const id = 'fake-id';
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);
      await expect(service.findOne(id)).rejects.toThrow(
        `Horário com o ID:${id} informado não foi encontrado`,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        `Horário com o ID:${id} informado não foi encontrado`,
      );
    });
  });

  describe('update', () => {
    it('should update a schedule successfully', async () => {
      const schedule = new Schedule(
        DiasSemana.SegundaFeira,
        '08:00:00',
        '10:00:00',
        '123',
      );
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(schedule);
      jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(true);
      jest
        .spyOn(service as any, 'validateUpdatePayload')
        .mockReturnValueOnce(undefined);

      const id = 'fake-id';
      const updateScheduleDto = {
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: '08:00:00',
        horaChegada: '10:00:00',
        idRota: '123',
        id: 'fake-id',
      };
      const scheduleExistsSpy = jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(true);

      jest.spyOn(repository, 'update').mockResolvedValueOnce(schedule);

      const result = await service.update(id, updateScheduleDto);
      expect(service['validateUpdatePayload']).toHaveBeenCalledWith(
        updateScheduleDto,
      );
      expect(service['checkScheduleExists']).toHaveBeenCalledWith({ id });
      expect(scheduleExistsSpy).toHaveBeenCalledWith({ id });
      expect(repository.update).toHaveBeenCalledWith(
        id,
        ScheduleMapper.toPersistence(updateScheduleDto),
      );

      expect(logger.log).toHaveBeenCalledWith(
        `Atualizando horário: ${JSON.stringify(updateScheduleDto)}`,
      );
      expect(result).toEqual(schedule);
    });

    it('should throw NotFoundException if schedule does not exist', async () => {
      const id = 'fake-id';
      jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(service as any, 'validateUpdatePayload')
        .mockReturnValueOnce(undefined);
      await expect(service.update(id, {})).rejects.toThrow(
        `Horário com o ID:fake-id informado para atualização não foi encontrado`,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        `Horário com o ID:${id} informado não foi encontrado`,
      );
    });

    it('should throw BadRequestException if no data is provided', async () => {
      const id = 'fake-id';
      const updateScheduleDto = {};
      jest.spyOn(service as any, 'validateUpdatePayload');
      await expect(service.update(id, updateScheduleDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service['validateUpdatePayload']).toHaveBeenCalledWith(
        updateScheduleDto,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        `Nenhum dado para atualização foi informado`,
      );
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const id = 'fake-id';
      const updateScheduleDto = {
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: '08:00:00',
        horaChegada: '10:00:00',
        idRota: '123',
      };
      const errorMessage = 'Error updating schedule';

      jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(true);
      jest
        .spyOn(repository, 'update')
        .mockRejectedValueOnce(new Error(errorMessage));
      await expect(service.update(id, updateScheduleDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao atualizar horário com ID:${id}`,
        expect.any(Error),
      );
    });

    it('should throw InternalServerErrorException on repository error code 23505', async () => {
      const id = 'fake-id';
      const updateScheduleDto = {
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: '08:00:00',
        horaChegada: '10:00:00',
        idRota: '123',
      };

      jest
        .spyOn(service as any, 'checkScheduleExists')
        .mockResolvedValueOnce(true);
      jest.spyOn(repository, 'update').mockRejectedValueOnce({ code: '23505' });
      await expect(service.update(id, updateScheduleDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Os novos dados informados formam um horário duplicado: ${JSON.stringify(
          updateScheduleDto,
        )}`,
      );
    });
  });

  describe('checkScheduleExists', () => {
    it('should return true if schedule exists', async () => {
      const criteria = { id: 'fake-id' };
      jest
        .spyOn(repository, 'findById')
        .mockResolvedValueOnce(
          new Schedule(DiasSemana.SegundaFeira, '08:00:00', '10:00:00', '123'),
        );
      const result = await service['checkScheduleExists'](criteria);
      expect(result).toBe(true);
    });

    it('should return false if schedule does not exist', async () => {
      const criteria = { id: 'fake-id' };
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);
      const result = await service['checkScheduleExists'](criteria);
      expect(result).toBe(false);
    });

    it('should return true if schedule exists by hours and route', async () => {
      const criteria = {
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: '08:00:00',
        horaChegada: '10:00:00',
        idRota: '123',
      };
      jest
        .spyOn(repository, 'findScheduleByHoursAndRoute')
        .mockResolvedValueOnce(
          ScheduleMapper.toDomain({
            id: 'fake-id',
            dia_semana: criteria.diaSemana,
            hora_partida: criteria.horaPartida,
            hora_chegada: criteria.horaChegada,
            id_rota: criteria.idRota,
            created_at: new Date(),
            updated_at: new Date(),
          }),
        );
      const result = await service['checkScheduleExists'](criteria);
      expect(result).toBe(true);
    });
    it('should return false if schedule does not exist by hours and route', async () => {
      const criteria = {
        diaSemana: DiasSemana.SegundaFeira,
        horaPartida: '08:00:00',
        horaChegada: '10:00:00',
        idRota: '123',
      };
      jest
        .spyOn(repository, 'findScheduleByHoursAndRoute')
        .mockResolvedValueOnce(null);
      const result = await service['checkScheduleExists'](criteria);
      expect(result).toBe(false);
    });
  });
  describe('validateUpdatePayload', () => {
    it('should throw BadRequestException if no data is provided', () => {
      const updateScheduleDto = {};
      expect(() => service['validateUpdatePayload'](updateScheduleDto)).toThrow(
        BadRequestException,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        `Nenhum dado para atualização foi informado`,
      );
    });

    it('should not throw if data is provided', () => {
      const updateScheduleDto = { diaSemana: DiasSemana.SegundaFeira };
      expect(() =>
        service['validateUpdatePayload'](updateScheduleDto),
      ).not.toThrow();
    });
  });
});
