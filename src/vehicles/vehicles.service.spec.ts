import { Test, TestingModule } from '@nestjs/testing';
import { Logger, Scope } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesRepository } from './vehicles.repository';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let repository: VehiclesRepository;
  let logger: Logger;

  const mockVehicles = [
    {
      id: '1',
      nome: 'Carro A',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: VehiclesRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByName: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
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

    service = module.get<VehiclesService>(VehiclesService);
    repository = module.get<VehiclesRepository>(VehiclesRepository);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll method from repository', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValueOnce(mockVehicles);
    const vehicles = await service.findAll();
    expect(vehicles).toEqual(mockVehicles);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should call findOne method from repository', async () => {
    const vehicleId = '1';
    jest.spyOn(repository, 'findById').mockResolvedValueOnce([mockVehicles[0]]);
    const vehicle = await service.findOne(vehicleId);
    expect(vehicle).toEqual(mockVehicles[0]);
    expect(repository.findById).toHaveBeenCalledWith(vehicleId);
  });

  it('should call create method from repository', async () => {
    const createVehicleDto = {
      nome: 'Carro A',
    };
    jest.spyOn(repository, 'findByName').mockResolvedValueOnce([]);
    jest.spyOn(repository, 'create').mockResolvedValueOnce([mockVehicles[0]]);

    const vehicle = await service.create(createVehicleDto);

    expect(logger.log).toHaveBeenCalledWith(
      `Criando veículo: ${JSON.stringify(createVehicleDto)}`,
    );

    expect(vehicle).toMatchObject({
      id: mockVehicles[0].id,
      nome: mockVehicles[0].nome,
      created_at: mockVehicles[0].created_at,
      updated_at: mockVehicles[0].updated_at,
    });
    expect(repository.findByName).toHaveBeenCalledWith(createVehicleDto.nome);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      `Veículo: ${JSON.stringify(createVehicleDto)} criado com sucesso`,
    );
  });

  it('should throw error if vehicle already exists', async () => {
    const createVehicleDto = {
      nome: 'Carro A',
    };
    jest
      .spyOn(repository, 'findByName')
      .mockResolvedValueOnce([mockVehicles[0]]);

    await expect(service.create(createVehicleDto)).rejects.toThrowError(
      `Veículo com o nome: ${createVehicleDto.nome} já existe`,
    );
    expect(repository.findByName).toHaveBeenCalledWith(createVehicleDto.nome);
    expect(repository.create).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      `Veículo com o nome: ${createVehicleDto.nome} já existe`,
    );
  });

  it('should call update method from repository', async () => {
    const vehicleId = '1';
    const updateVehicleDto = {
      nome: 'Carro B',
    };
    jest.spyOn(repository, 'findById').mockResolvedValueOnce([mockVehicles[0]]);
    jest.spyOn(repository, 'update').mockResolvedValueOnce(mockVehicles[0]);
    const vehicle = await service.update(vehicleId, updateVehicleDto);
    expect(vehicle).toEqual(mockVehicles[0]);
    expect(repository.findById).toHaveBeenCalledWith(vehicleId);
    expect(repository.update).toHaveBeenCalledWith(vehicleId, updateVehicleDto);
    expect(logger.log).toHaveBeenCalledWith(
      `Atualizando veículo com id: ${vehicleId}`,
    );
  });

  it('should throw error if vehicle to update does not exist', async () => {
    const vehicleId = '1';
    const updateVehicleDto = {
      nome: 'Carro B',
    };
    jest.spyOn(repository, 'findById').mockResolvedValueOnce([]);

    await expect(
      service.update(vehicleId, updateVehicleDto),
    ).rejects.toThrowError(
      `Veículo com o ID:${vehicleId} informado não foi encontrado`,
    );
    expect(repository.findById).toHaveBeenCalledWith(vehicleId);
    expect(repository.update).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      `Veículo com o ID:${vehicleId} informado não foi encontrado`,
    );
  });

  it('should call delete method from repository', async () => {
    const vehicleId = '1';
    jest.spyOn(repository, 'delete').mockResolvedValueOnce({
      id: vehicleId,
    });

    jest.spyOn(repository, 'findById').mockResolvedValueOnce([mockVehicles[0]]);
    await service.remove(vehicleId);
    expect(repository.delete).toHaveBeenCalledWith(vehicleId);
    expect(logger.log).toHaveBeenCalledWith(
      `Removendo veículo com id: ${vehicleId}`,
    );
    expect(logger.log).toHaveBeenCalledWith(
      `Veículo com id: ${vehicleId} removido com sucesso`,
    );
  });

  describe('verifyVehicle', () => {
    it('should call checkVehicleById method', async () => {
      const vehicleId = '1';
      jest
        .spyOn(service as any, 'checkVehicleById')
        .mockResolvedValueOnce(true);
      const result = await (service as any).verifyVehicleExist({
        id: vehicleId,
      });
      expect(result).toBe(true);
      expect((service as any).checkVehicleById).toHaveBeenCalledWith(vehicleId);
    });

    it('should call checkVehicleByName method', async () => {
      const vehicleName = 'Carro A';
      jest
        .spyOn(service as any, 'checkVehicleByName')
        .mockResolvedValueOnce(true);
      const result = await (service as any).verifyVehicleExist({
        nome: vehicleName,
      });
      expect(result).toBe(true);
      expect((service as any).checkVehicleByName).toHaveBeenCalledWith(
        vehicleName,
      );
    });
  });
});
