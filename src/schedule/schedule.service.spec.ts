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
