import { Test, TestingModule } from '@nestjs/testing';
import { CityRepository } from './city.repository';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';

describe('CityRepository', () => {
  let repository: CityRepository;
  let db: Kysely<Database>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityRepository,
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

    repository = module.get<CityRepository>(CityRepository);
    db = module.get('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should call findAll method', async () => {
    await repository.findAll();
    expect(db.selectFrom('cidades').selectAll().execute).toHaveBeenCalled();
  });

  it('should call findById method', async () => {
    await repository.findById('1');
    expect(db.selectFrom('cidades').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      '1',
    );
    expect(db.selectFrom('cidades').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('cidades').selectAll().execute).toHaveBeenCalled();
  });

  it('should call create method', async () => {
    await repository.create({
      id: '1',
      nome: 'Nome',
      uf: 'UF',
      cod_ibge: 1,
    });
    expect(db.transaction().execute).toHaveBeenCalled();
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call findByNameAndCode method', async () => {
    await repository.findByNameAndCode('Nome', 1);
    expect(db.selectFrom('cidades').selectAll().where).toHaveBeenCalledWith(
      'nome',
      '=',
      'Nome',
    );
    expect(db.selectFrom('cidades').selectAll().where).toHaveBeenCalledWith(
      'codigo_ibge',
      '=',
      1,
    );
    expect(db.selectFrom('cidades').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('cidades').selectAll().execute).toHaveBeenCalled();
  });
});
