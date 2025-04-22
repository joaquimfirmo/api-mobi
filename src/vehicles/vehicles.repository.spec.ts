import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesRepository } from './vehicles.repository';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';

describe('VehiclesRepository', () => {
  let repository: VehiclesRepository;
  let db: Kysely<Database>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesRepository,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {
            selectFrom: jest.fn().mockReturnThis(),
            selectAll: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            transaction: jest.fn().mockReturnThis(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<VehiclesRepository>(VehiclesRepository);
    db = module.get('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should call findAll method', async () => {
    await repository.findAll();
    expect(db.selectFrom('veiculos').selectAll().execute).toHaveBeenCalled();
  });

  it('should call findById method', async () => {
    await repository.findById('1');
    expect(db.selectFrom('veiculos').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      '1',
    );
    expect(db.selectFrom('veiculos').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('veiculos').selectAll().execute).toHaveBeenCalled();
  });

  it('should call findByName method', async () => {
    await repository.findByName('Nome');
    expect(db.selectFrom('veiculos').selectAll().where).toHaveBeenCalledWith(
      'nome',
      '=',
      'Nome',
    );
    expect(db.selectFrom('veiculos').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('veiculos').selectAll().execute).toHaveBeenCalled();
  });

  it('should call create method', async () => {
    await repository.create({
      id: '1',
      nome: 'Nome',
      created_at: new Date(),
      updated_at: '',
    });
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call update method', async () => {
    await repository.update('1', {
      nome: 'Nome',
    });
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call delete method', async () => {
    await repository.delete('1');
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });
});
