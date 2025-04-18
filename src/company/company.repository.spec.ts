import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepository } from './company.repository';
import { Kysely } from 'kysely';
import { Database } from '../common/database/types';

describe('CompanyRepository', () => {
  let repository: CompanyRepository;
  let db: Kysely<Database>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyRepository,
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

    repository = module.get<CompanyRepository>(CompanyRepository);
    db = module.get('DATABASE_CONNECTION');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should call findAll method', async () => {
    await repository.findAll();
    expect(db.selectFrom('empresas').selectAll().execute).toHaveBeenCalled();
  });

  it('should call findById method', async () => {
    await repository.findById('1');
    expect(db.selectFrom('empresas').selectAll().where).toHaveBeenCalledWith(
      'id',
      '=',
      '1',
    );
    expect(db.selectFrom('empresas').selectAll().limit).toHaveBeenCalledWith(1);
    expect(db.selectFrom('empresas').selectAll().execute).toHaveBeenCalled();
  });

  it('should call create method', async () => {
    await repository.create({
      razaoSocial: 'Razao Social',
      nomeFantasia: 'Nome Fantasia',
      cnpj: '123456789',
      email: 'example@email.com',
      id: '1',
      createdAt: '',
      updatedAt: '',
    });
    expect(db.transaction().execute).toHaveBeenCalled();
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call update method', async () => {
    await repository.update('1', {
      razaoSocial: 'Razao Social',
      nomeFantasia: 'Nome Fantasia',
      cnpj: '123456789',
      email: 'example@email.com',
    });
    expect(db.transaction().execute).toHaveBeenCalled();
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call delete method', async () => {
    await repository.delete('1');
    expect(db.transaction().execute).toHaveBeenCalled();
    expect(db.transaction().execute).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call findByRazaoSocial method', async () => {
    await repository.findByRazaoSocial('Razao Social');
    expect(db.selectFrom('empresas').selectAll().where).toHaveBeenCalledWith(
      'razao_social',
      '=',
      'Razao Social',
    );
    expect(db.selectFrom('empresas').selectAll().execute).toHaveBeenCalled();
  });

  it('should call findByCnpj method', async () => {
    await repository.findByCnpj('123456789');
    expect(db.selectFrom('empresas').selectAll().where).toHaveBeenCalledWith(
      'cnpj',
      '=',
      '123456789',
    );
    expect(db.selectFrom('empresas').selectAll().execute).toHaveBeenCalled();
  });
});
