import { Injectable, Inject } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';

type Company = {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  id_cidade: string;
  created_at: Date | string;
  updated_at: Date | string | null;
};
@Injectable()
export class CompanyRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}
  async findAll(): Promise<Company[]> {
    const empresas = await this.db.selectFrom('empresas').selectAll().execute();
    return empresas;
  }

  async findById(id: string): Promise<any> {
    return await this.db
      .selectFrom('empresas')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .execute();
  }

  async create(company: any): Promise<any> {
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
        .returning(['id', 'nome_fantasia', 'razao_social', 'cnpj', 'id_cidade'])
        .executeTakeFirstOrThrow();
    });
  }

  async update(id: string, company: any): Promise<any> {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .updateTable('empresas')
        .set({
          ...(company.razaoSocial && { razao_social: company.razaoSocial }),
          ...(company.nomeFantasia && { nome_fantasia: company.nomeFantasia }),
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
  }

  async delete(id: string): Promise<any> {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .deleteFrom('empresas')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirstOrThrow();
    });
  }

  async findByCnpj(cnpj: string): Promise<any> {
    return await this.db
      .selectFrom('empresas')
      .selectAll()
      .where('cnpj', '=', cnpj)
      .limit(1)
      .execute();
  }

  async findByRazaoSocial(razaoSocial: string): Promise<any> {
    return await this.db
      .selectFrom('empresas')
      .selectAll()
      .where('razao_social', '=', razaoSocial)
      .limit(1)
      .execute();
  }
}
