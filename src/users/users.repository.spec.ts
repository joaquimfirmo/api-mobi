import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let db: Kysely<Database>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: {
            selectFrom: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            selectAll: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            transaction: jest.fn().mockReturnThis(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    db = module.get('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should call findAll method', async () => {
    await repository.findAll();
    expect(db.selectFrom('usuarios').selectAll().execute).toHaveBeenCalled();
  });

  it('should call findById method', async () => {
    await repository.findById('1');
    expect(db.selectFrom('usuarios').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      '1',
    );
    expect(db.selectFrom('usuarios').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('usuarios').selectAll().execute).toHaveBeenCalled();
  });

  it('should call create method', async () => {
    await repository.create({
      name: 'Nome',
      email: 'email',
      password: 'password',
      permissions: 'USER',
      createdAt: new Date(),
      updatedAt: '',
      id: '1',
    });
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call update method', async () => {
    await repository.update('1', {
      nome: 'Nome',
    });
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call delete method', async () => {
    await repository.delete('1');
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });
});
