import { Test, TestingModule } from '@nestjs/testing';
import { Logger, Scope } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsRepository } from './transports.repository';

describe('TransportsService', () => {
  let service: TransportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportsService,
        {
          provide: TransportsRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: Logger,
          scope: Scope.TRANSIENT,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransportsService>(TransportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
