import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { DiasSemana } from '../types/enums/dias-semana.enum';
describe('ScheduleController', () => {
  let controller: ScheduleController;

  const dto = {
    diaSemana: DiasSemana.SegundaFeira,
    horaPartida: '08:00:00',
    horaChegada: '10:00:00',
    idRota: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
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

    controller = module.get<ScheduleController>(ScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll method with filters', async () => {
    const result = [];
    const filters = {
      dia_semana: 'Monday',
      hora_partida: '08:00',
      hora_chegada: '10:00',
      id_rota: '1',
    };
    jest
      .spyOn(controller['scheduleService'], 'findAll')
      .mockResolvedValue(result);

    expect(
      await controller.findAll({
        page: 0,
        limit: 25,
        ...filters,
      }),
    ).toBe(result);
    expect(controller['scheduleService'].findAll).toHaveBeenCalledWith(
      filters,
      0,
      25,
    );
  });

  it('should call findOne method with id', async () => {
    const result = new Schedule(DiasSemana.SegundaFeira, '08:00', '10:00', '1');
    const id = '1';
    jest
      .spyOn(controller['scheduleService'], 'findOne')
      .mockResolvedValue(result);

    expect(await controller.findOne(id)).toBe(result);
    expect(controller['scheduleService'].findOne).toHaveBeenCalledWith(id);
  });

  it('should call create method with dto', async () => {
    const result = new Schedule(DiasSemana.SegundaFeira, '08:00', '10:00', '1');
    jest
      .spyOn(controller['scheduleService'], 'create')
      .mockResolvedValue(result);

    expect(await controller.create(dto)).toBe(result);
    expect(controller['scheduleService'].create).toHaveBeenCalledWith(dto);
  });

  it('should call update method with id and dto', async () => {
    const id = '1';

    const result = new Schedule(DiasSemana.SegundaFeira, '08:00', '10:00', '1');
    jest
      .spyOn(controller['scheduleService'], 'update')
      .mockResolvedValue(result);

    expect(await controller.update(id, dto)).toBe(result);
    expect(controller['scheduleService'].update).toHaveBeenCalledWith(id, dto);
  });

  it('should call remove method with id', async () => {
    const id = '1';
    jest.spyOn(controller['scheduleService'], 'remove').mockResolvedValue();

    await controller.remove(id);
    expect(controller['scheduleService'].remove).toHaveBeenCalledWith(id);
  });
});
