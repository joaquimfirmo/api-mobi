import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  const mockVehicles = [
    {
      id: '1',
      nome: 'Carro A',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll method from service', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockVehicles);
    expect(await controller.findAll()).toBe(mockVehicles);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should call findOne method from service', async () => {
    const id = '1';
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockVehicles[0]);
    expect(await controller.findOne(id)).toBe(mockVehicles[0]);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should call create method from service', async () => {
    const createVehicleDto = {
      nome: 'Carro B',
    };
    jest.spyOn(service, 'create').mockResolvedValueOnce(mockVehicles[0]);
    expect(await controller.create(createVehicleDto)).toBe(mockVehicles[0]);
    expect(service.create).toHaveBeenCalledWith(createVehicleDto);
  });
  it('should call update method from service', async () => {
    const id = '1';
    const updateVehicleDto = {
      nome: 'Carro B',
    };
    jest.spyOn(service, 'update').mockResolvedValueOnce(mockVehicles[0]);
    expect(await controller.update(id, updateVehicleDto)).toBe(mockVehicles[0]);
    expect(service.update).toHaveBeenCalledWith(id, updateVehicleDto);
  });

  it('should call remove method from service', async () => {
    const id = '1';
    jest.spyOn(service, 'remove');
    expect(await controller.remove(id)).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
