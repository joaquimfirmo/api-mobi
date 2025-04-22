import { Injectable, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from 'src/common/database/types';
import { City } from './entities/city';
import { CityMapper } from './mapper/city-mapper';
import { CityDto } from './dto/city-dto';

@Injectable()
export class CityRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll(): Promise<City[]> {
    const cities = await this.db.selectFrom('cidades').selectAll().execute();
    return cities.map((city: CityDto) => CityMapper.toDomain(city));
  }

  async findById(id: string): Promise<City | null> {
    const city = await this.db
      .selectFrom('cidades')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .execute();

    if (city.length === 0) {
      return null;
    }

    return CityMapper.toDomain(city[0]);
  }

  async create(city: City): Promise<any> {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .insertInto('cidades')
        .values({
          id: city.id,
          nome: city.nome,
          uf: city.uf,
          codigo_ibge: city.codigoIbge,
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
