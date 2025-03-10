import { Test, TestingModule } from '@nestjs/testing';
import { Logger, Scope } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: Logger,
          scope: Scope.TRANSIENT,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: ScheduleRepository,
          useValue: {
            findScheduleByHoursAndRoute: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
