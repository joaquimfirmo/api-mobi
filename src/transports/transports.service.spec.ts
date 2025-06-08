import { Test, TestingModule } from '@nestjs/testing';
import {
  Logger,
  Scope,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsRepository } from './transports.repository';
import { CompanyRepository } from '../company/company.repository';
import { RoutesRepository } from '../route/routes.repository';
import { ScheduleRepository } from '../schedule/schedule.repository';
import { VehiclesRepository } from '../vehicles/vehicles.repository';
import { DiasSemana } from '../types/enums/dias-semana.enum';

describe('TransportsService', () => {
  let service: TransportsService;
  let repository: TransportsRepository;
  let companyRepository: CompanyRepository;
  let routesRepository: RoutesRepository;
  let scheduleRepository: ScheduleRepository;
  let vehiclesRepository: VehiclesRepository;
  let logger: Logger;

  const mockTransports = [
    {
      rota: 'Cidade A - Cidade B',
      empresa: 'Empresa A',
      preco: 2000,
      distanciaKm: '60',
      duracao: {
        hours: 1,
      },
      veiculo: 'Van',
      viaPrincipal: 'Via Principal A',
      diaSemana: 'Segunda-feira',
      horarioPartida: '07:00:00',
      horarioChegada: '08:00:00',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportsService,
        {
          provide: TransportsRepository,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            exists: jest.fn(),
          },
        },

        {
          provide: CompanyRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: RoutesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ScheduleRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: VehiclesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: Logger,
          scope: Scope.TRANSIENT,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransportsService>(TransportsService);
    repository = module.get<TransportsRepository>(TransportsRepository);
    companyRepository = module.get<CompanyRepository>(CompanyRepository);
    routesRepository = module.get<RoutesRepository>(RoutesRepository);
    scheduleRepository = module.get<ScheduleRepository>(ScheduleRepository);
    vehiclesRepository = module.get<VehiclesRepository>(VehiclesRepository);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll method from repository', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValueOnce(
      mockTransports.map((transport) => ({
        ...transport,
        preco: transport.preco / 100, // Simulating conversion to float
      })),
    );
    const filters = {
      diaSemana: DiasSemana.SegundaFeira,
    };

    const result = await service.findAll(filters, 1, 10);
    expect(repository.findAll).toHaveBeenCalledWith(filters, 1, 10);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      `Fetching transports with filters: ${JSON.stringify(filters)}`,
    );

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      {
        ...mockTransports[0],
        preco: 20,
      },
    ]);
  });

  it('should log a warning if no transports are found', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValueOnce([]);
    const filters = {
      diaSemana: DiasSemana.SegundaFeira,
    };

    const result = await service.findAll(filters, 1, 10);
    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      `No transports found for filters: ${JSON.stringify(filters)}`,
    );
  });

  it('should create a transport', async () => {
    const createTransportDto = {
      empresaId: '1',
      rotaId: '2',
      horarioId: '3',
      veiculoId: '4',
      precoPassagem: 20,
    };

    jest.spyOn(companyRepository, 'findById').mockResolvedValueOnce([
      {
        id: createTransportDto.empresaId,
        nome_fantasia: 'Empresa A',
        razao_social: 'Razão Social A',
        cnpj: '12345678901234',
        email: 'empresaA@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    jest.spyOn(routesRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.rotaId,
      nome: 'Rota A',
      idCidadeOrigem: '1',
      idCidadeDestino: '2',
      distancia: 12,
      tempoEstimado: '00:30:00',
      local: 'Via Principal A',
      viaPrincipal: 'Via Principal A',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(scheduleRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.horarioId,
      horaPartida: '07:00:00',
      horaChegada: '08:00:00',
      diaSemana: DiasSemana.SegundaFeira,
      idRota: createTransportDto.rotaId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(vehiclesRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.veiculoId,
      nome: 'Veículo A',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(repository, 'create').mockResolvedValueOnce({
      id: 'new-transport-id',
      id_empresa: createTransportDto.empresaId,
      id_rota: createTransportDto.rotaId,
      id_horario: createTransportDto.horarioId,
      id_veiculo: createTransportDto.veiculoId,
      preco_passagem: createTransportDto.precoPassagem * 100, // Convert to cents
      created_at: new Date(),
      updated_at: new Date(),
    });

    jest.spyOn(repository, 'exists').mockResolvedValueOnce(false);

    const result = await service.create(createTransportDto);
    expect(companyRepository.findById).toHaveBeenCalledWith(
      createTransportDto.empresaId,
    );
    expect(repository.create).toHaveBeenCalledWith({
      id: expect.any(String),
      id_empresa: createTransportDto.empresaId,
      id_rota: createTransportDto.rotaId,
      id_horario: createTransportDto.horarioId,
      id_veiculo: createTransportDto.veiculoId,
      preco_passagem: createTransportDto.precoPassagem * 100,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
    expect(result).toEqual({
      id: expect.any(String),
      id_empresa: createTransportDto.empresaId,
      id_rota: createTransportDto.rotaId,
      id_horario: createTransportDto.horarioId,
      id_veiculo: createTransportDto.veiculoId,
      preco_passagem: createTransportDto.precoPassagem * 100,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
  });

  it('should throw an error if transport already exists', async () => {
    const createTransportDto = {
      empresaId: '1',
      rotaId: '2',
      horarioId: '3',
      veiculoId: '4',
      precoPassagem: 20,
    };

    jest.spyOn(companyRepository, 'findById').mockResolvedValueOnce([
      {
        id: createTransportDto.empresaId,
        nome_fantasia: 'Empresa A',
        razao_social: 'Razão Social A',
        cnpj: '12345678901234',
        email: 'empresaA@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    jest.spyOn(routesRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.rotaId,
      nome: 'Rota A',
      idCidadeOrigem: '1',
      idCidadeDestino: '2',
      distancia: 12,
      tempoEstimado: '00:30:00',
      local: 'Via Principal A',
      viaPrincipal: 'Via Principal A',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(scheduleRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.horarioId,
      horaPartida: '07:00:00',
      horaChegada: '08:00:00',
      diaSemana: DiasSemana.SegundaFeira,
      idRota: createTransportDto.rotaId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(vehiclesRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.veiculoId,
      nome: 'Veículo A',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(repository, 'create').mockResolvedValueOnce({
      id: 'new-transport-id',
      id_empresa: createTransportDto.empresaId,
      id_rota: createTransportDto.rotaId,
      id_horario: createTransportDto.horarioId,
      id_veiculo: createTransportDto.veiculoId,
      preco_passagem: createTransportDto.precoPassagem * 100, // Convert to cents
      created_at: new Date(),
      updated_at: new Date(),
    });

    jest.spyOn(repository, 'exists').mockResolvedValueOnce(true);

    await expect(service.create(createTransportDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(logger.log).toHaveBeenCalledWith(
      `Verificando se transporte já existe para os IDs: Empresa: ${createTransportDto.empresaId}, Rota: ${createTransportDto.rotaId}, Horário: ${createTransportDto.horarioId}, Veículo: ${createTransportDto.veiculoId}`,
    );

    expect(logger.error).toHaveBeenCalledWith(
      `Transporte já existe para os IDs informados: ${JSON.stringify(createTransportDto)}`,
      `TransportsService.ensureTransportDoesNotExist`,
    );
  });

  it('should validate IDs before creating a transport', async () => {
    const createTransportDto = {
      empresaId: '1',
      rotaId: '2',
      horarioId: '3',
      veiculoId: '4',
      precoPassagem: 20,
    };

    jest.spyOn(companyRepository, 'findById').mockResolvedValueOnce([
      {
        id: createTransportDto.empresaId,
        nome_fantasia: 'Empresa A',
        razao_social: 'Razão Social A',
        cnpj: '12345678901234',
        email: 'empresaA@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    jest.spyOn(routesRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.rotaId,
      nome: 'Rota A',
      idCidadeOrigem: '1',
      idCidadeDestino: '2',
      distancia: 12,
      tempoEstimado: '00:30:00',
      local: 'Via Principal A',
      viaPrincipal: 'Via Principal A',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(scheduleRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.horarioId,
      horaPartida: '07:00:00',
      horaChegada: '08:00:00',
      diaSemana: DiasSemana.SegundaFeira,
      idRota: createTransportDto.rotaId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(vehiclesRepository, 'findById').mockResolvedValueOnce({
      id: createTransportDto.veiculoId,
      nome: 'Veículo A',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const spyValidadeIds = jest.spyOn(service as any, 'validateIds');

    jest.spyOn(repository, 'create').mockResolvedValueOnce({
      id: 'new-transport-id',
      id_empresa: createTransportDto.empresaId,
      id_rota: createTransportDto.rotaId,
      id_horario: createTransportDto.horarioId,
      id_veiculo: createTransportDto.veiculoId,
      preco_passagem: createTransportDto.precoPassagem * 100, // Convert to cents
      created_at: new Date(),
      updated_at: new Date(),
    });

    jest.spyOn(repository, 'exists').mockResolvedValueOnce(false);

    await service.create(createTransportDto);
    expect(companyRepository.findById).toHaveBeenCalledWith(
      createTransportDto.empresaId,
    );
    expect(routesRepository.findById).toHaveBeenCalledWith(
      createTransportDto.rotaId,
    );
    expect(scheduleRepository.findById).toHaveBeenCalledWith(
      createTransportDto.horarioId,
    );

    expect(vehiclesRepository.findById).toHaveBeenCalledWith(
      createTransportDto.veiculoId,
    );

    expect(spyValidadeIds).toHaveBeenCalledWith(
      createTransportDto.empresaId,
      createTransportDto.rotaId,
      createTransportDto.horarioId,
      createTransportDto.veiculoId,
    );
    expect(logger.log).toHaveBeenCalledWith(
      `Validando IDs - Empresa: ${createTransportDto.empresaId}, Rota: ${createTransportDto.rotaId}, Horário: ${createTransportDto.horarioId}, Veículo: ${createTransportDto.veiculoId}`,
    );
  });

  it('should log an error if validation fails', async () => {
    const createTransportDto = {
      empresaId: '1',
      rotaId: '2',
      horarioId: '3',
      veiculoId: '4',
      precoPassagem: 20,
    };

    jest.spyOn(companyRepository, 'findById').mockResolvedValueOnce([]);
    jest.spyOn(logger, 'error').mockImplementation(() => {});

    await expect(service.create(createTransportDto)).rejects.toThrow(
      NotFoundException,
    );

    expect(logger.error).toHaveBeenCalledWith(
      `Empresa com ID ${createTransportDto.empresaId} não existe`,
      `TransportsService.validateIds`,
    );
  });
});
