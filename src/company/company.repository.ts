import {
  Injectable,
  Inject,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';
import Company from './entities/company.entity';
import { UpdateCompanyRequestDTO } from './dtos';

@Injectable()
export class CompanyRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}
  async findAll() {
    try {
      return await this.db.selectFrom('empresas').selectAll().execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar empresas',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.db
        .selectFrom('empresas')
        .selectAll()
        .where('id', '=', id)
        .limit(1)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar empresa',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async create(company: Company) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .insertInto('empresas')
          .values({
            id: company.id,
            razao_social: company.razaoSocial,
            nome_fantasia: company.nomeFantasia,
            cnpj: company.cnpj,
            id_cidade: company.idCidade,
          })
          .returning([
            'id',
            'nome_fantasia',
            'razao_social',
            'cnpj',
            'id_cidade',
            'created_at',
            'updated_at',
          ])
          .executeTakeFirstOrThrow();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao criar empresa',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: string, company: UpdateCompanyRequestDTO) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .updateTable('empresas')
          .set({
            ...(company.razaoSocial && { razao_social: company.razaoSocial }),
            ...(company.nomeFantasia && {
              nome_fantasia: company.nomeFantasia,
            }),
            ...(company.cnpj && { cnpj: company.cnpj }),
            ...(company.idCidade && { id_cidade: company.idCidade }),
            updated_at: sql`now()`,
          })
          .where('id', '=', id)
          .returning([
            'id',
            'nome_fantasia',
            'razao_social',
            'cnpj',
            'id_cidade',
            'created_at',
            'updated_at',
          ])
          .executeTakeFirstOrThrow();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao atualizar empresa',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async delete(id: string) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .deleteFrom('empresas')
          .where('id', '=', id)
          .returning(['id'])
          .executeTakeFirstOrThrow();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao deletar empresa',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findByCnpj(cnpj: string) {
    try {
      return await this.db
        .selectFrom('empresas')
        .selectAll()
        .where('cnpj', '=', cnpj)
        .limit(1)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar empresa por CNPJ',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findByRazaoSocial(razaoSocial: string) {
    try {
      return await this.db
        .selectFrom('empresas')
        .selectAll()
        .where('razao_social', '=', razaoSocial)
        .limit(1)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar empresa por Razão Social',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
