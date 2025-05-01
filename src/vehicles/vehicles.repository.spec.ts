import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesRepository } from './vehicles.repository';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';
import { DatabaseException } from '../common/execptions/database.execption';
import { VehicleMapper } from './mapper/vehicles.mapper';

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
    db.selectFrom('veiculos').selectAll().execute = jest
      .fn()
      .mockResolvedValue([
        VehicleMapper.toPersistence({ id: '1', nome: 'Nome' }),
      ]);
    await repository.findAll();
    expect(db.selectFrom('veiculos').selectAll().execute).toHaveBeenCalled();
  });

  it('should throw DatabaseException if findAll fails', async () => {
    db.selectFrom('veiculos').selectAll().execute = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));
    await expect(repository.findAll()).rejects.toThrow(DatabaseException);
    await expect(repository.findAll()).rejects.toThrow(
      'Não foi possível buscar veículos',
    );
  });

  it('should call findById method', async () => {
    db.selectFrom('veiculos').selectAll().where('id', '=', '1').execute = jest
      .fn()
      .mockResolvedValue([
        { id: '1', nome: 'Nome', created_at: new Date(), updated_at: '' },
      ]);
    await repository.findById('1');
    expect(db.selectFrom('veiculos').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      '1',
    );
    expect(db.selectFrom('veiculos').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('veiculos').selectAll().execute).toHaveBeenCalled();
  });

  it('should throw DatabaseException if findById fails', async () => {
    db.selectFrom('veiculos').selectAll().where('id', '=', '1').execute = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));
    await expect(repository.findById('1')).rejects.toThrow(DatabaseException);
    await expect(repository.findById('1')).rejects.toThrow(
      'Não foi possível buscar veículo com o id 1',
    );
  });

  it('should call findByName method', async () => {
    db.selectFrom('veiculos').selectAll().where('nome', '=', 'Nome').execute =
      jest
        .fn()
        .mockResolvedValue([
          { id: '1', nome: 'Nome', created_at: new Date(), updated_at: '' },
        ]);
    await repository.findByName('Nome');
    expect(db.selectFrom('veiculos').selectAll().where).toHaveBeenCalledWith(
      'nome',
      '=',
      'Nome',
    );
    expect(db.selectFrom('veiculos').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('veiculos').selectAll().execute).toHaveBeenCalled();
  });

  it('should throw DatabaseException if findByName fails', async () => {
    db.selectFrom('veiculos').selectAll().where('nome', '=', 'Nome').execute =
      jest.fn().mockRejectedValue(new Error('Database error'));
    await expect(repository.findByName('Nome')).rejects.toThrow(
      DatabaseException,
    );
    await expect(repository.findByName('Nome')).rejects.toThrow(
      'Não foi possível buscar veículo com o nome Nome',
    );
  });

  it('should call create method', async () => {
    db.transaction().execute = jest.fn().mockResolvedValue([
      VehicleMapper.toDomain({
        id: '1',
        nome: 'Nome',
        created_at: new Date(),
        updated_at: new Date(),
      }),
    ]);

    await repository.create(
      VehicleMapper.toPersistence({ id: '1', nome: 'Nome' }),
    );
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should throw DatabaseException if create fails', async () => {
    db.transaction().execute = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));
    await expect(
      repository.create(
        VehicleMapper.toPersistence({
          id: '1',
          nome: 'Nome',
        }),
      ),
    ).rejects.toThrow(DatabaseException);
    await expect(
      repository.create(VehicleMapper.toPersistence({ id: '1', nome: 'Nome' })),
    ).rejects.toThrow('Não foi possível criar veículo com o nome Nome');
  });

  it('should call update method', async () => {
    db.transaction().execute = jest.fn().mockResolvedValue([
      VehicleMapper.toPersistence({
        id: '1',
        nome: 'Carro',
      }),
    ]);
    await repository.update('1', {
      nome: 'Carro',
    });
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should throw DatabaseException if update fails', async () => {
    db.transaction().execute = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));
    await expect(
      repository.update('1', {
        nome: 'Nome',
      }),
    ).rejects.toThrow(DatabaseException);
    await expect(
      repository.update('1', {
        nome: 'Nome',
      }),
    ).rejects.toThrow(
      'Não foi possível atualizar veículo com o ID 1: Database error',
    );
  });

  it('should call delete method', async () => {
    await repository.delete('1');
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should throw DatabaseException if delete fails', async () => {
    db.transaction().execute = jest
      .fn()
      .mockRejectedValue(new Error('Database error'));
    await expect(repository.delete('1')).rejects.toThrow(DatabaseException);
    await expect(repository.delete('1')).rejects.toThrow(
      'Não foi possível deletar veículo com o ID 1: Database error',
    );
  });
});
