import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';
import City from './entities/city';

@Injectable()
export class CityRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll(): Promise<any> {
    const cidades = await this.db.selectFrom('cidades').selectAll().execute();
    return cidades;
  }

  async findById(id: string): Promise<any> {
    return await this.db
      .selectFrom('cidades')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .execute();
  }

  async create(city: City): Promise<any> {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .insertInto('cidades')
        .values({
          id: city.id,
          nome: city.nome,
          uf: city.uf,
          codigo_ibge: city.cod_ibge,
        })
        .returning(['id', 'nome', 'uf'])
        .executeTakeFirstOrThrow();
    });
  }

  async findByNameAndCode(name: string, code: number): Promise<any> {
    return await this.db
      .selectFrom('cidades')
      .selectAll()
      .where('nome', '=', name)
      .where('codigo_ibge', '=', code)
      .limit(1)
      .execute();
  }
}
