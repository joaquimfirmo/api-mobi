import { Injectable, Inject } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database, Routes } from 'src/common/database/types';
import { Route } from './entities/route.entity';
import { RouteMapper } from './mapper/route.mapper';
import { DatabaseException } from '../common/execptions/database.execption';

@Injectable()
export class RoutesRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  private buildQuery(criteria: Partial<Routes>) {
    let query = this.db.selectFrom('rotas').selectAll();

    if (criteria.nome) {
      query = query.where('nome', '=', criteria.nome);
    }

    if (criteria.id_cidade_origem) {
      query = query.where('id_cidade_origem', '=', criteria.id_cidade_origem);
    }
    if (criteria.id_cidade_destino) {
      query = query.where('id_cidade_destino', '=', criteria.id_cidade_destino);
    }
    if (criteria.distancia) {
      query = query.where('distancia', '=', criteria.distancia);
    }
    if (criteria.tempo_estimado) {
      query = query.where('tempo_estimado', '=', criteria.tempo_estimado);
    }
    if (criteria.local) {
      query = query.where('local', '=', criteria.local);
    }
    if (criteria.via_principal) {
      query = query.where('via_principal', '=', criteria.via_principal);
    }

    return query;
  }

  async findAll(
    filters: Partial<Route>,
    page: number,
    limit: number,
  ): Promise<Route[]> {
    try {
      const query = this.buildQuery(filters);
      const offset = page * limit;
      const routes = await query
        .selectAll()
        .limit(limit)
        .offset(offset)
        .execute();
      return routes.map((route) => {
        return RouteMapper.toDomain(route);
      });
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar rotas com os filtros ${JSON.stringify(filters)}`,
        error,
        'RoutesRepository',
      );
    }
  }

  async findById(id: string): Promise<Route | null> {
    try {
      const [result] = await this.db
        .selectFrom('rotas')
        .selectAll()
        .where('id', '=', id)
        .limit(1)
        .execute();

      if (result?.created_at) {
        return RouteMapper.toDomain(result);
      }
      return null;
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar a rota com o ID ${id}`,
        error,
        'RoutesRepository',
      );
    }
  }

  async create(route: Partial<Routes>): Promise<Route> {
    try {
      const [result] = await this.db.transaction().execute(async (trx) => {
        return await trx
          .insertInto('rotas')
          .values({
            id: route.id,
            nome: route.nome,
            id_cidade_origem: route.id_cidade_origem,
            id_cidade_destino: route.id_cidade_destino,
            distancia: route.distancia,
            tempo_estimado: route.tempo_estimado,
            local: route.local,
            via_principal: route.via_principal,
          })
          .returning([
            'id',
            'nome',
            'id_cidade_origem',
            'id_cidade_destino',
            'distancia',
            'tempo_estimado',
            'local',
            'via_principal',
            'created_at',
            'updated_at',
          ])
          .execute();
      });

      return RouteMapper.toDomain(result);
    } catch (error) {
      throw new DatabaseException(
        'Não foi possível criar a rota',
        error,
        'RoutesRepository',
      );
    }
  }

  async update(id: string, route: Partial<Routes>): Promise<Route> {
    try {
      const result = await this.db.transaction().execute(async (trx) => {
        return await trx
          .updateTable('rotas')
          .set({
            ...{ nome: route.nome },
            ...{
              cidade_origem: route.id_cidade_origem,
            },
            ...{
              cidade_destino: route.id_cidade_destino,
            },
            ...{ distancia: route.distancia },
            ...{
              tempo_estimado: route.tempo_estimado,
            },
            ...{ local: route.local },
            ...{ via_principal: route.via_principal },
            updated_at: sql`now()`,
          })
          .where('id', '=', id)
          .returningAll()
          .executeTakeFirstOrThrow();
      });

      return RouteMapper.toDomain(result);
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível atualizar a rota com o ID ${id}`,
        error,
        'RoutesRepository',
      );
    }
  }

  async delete(id: string) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx.deleteFrom('rotas').where('id', '=', id).execute();
      });
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível excluir a rota com o ID ${id}`,
        error,
        'RoutesRepository',
      );
    }
  }

  async findRouteByCities(
    idOriginCity: string,
    idDestinationCity: string,
  ): Promise<Route | null> {
    try {
      const [result] = await this.db
        .selectFrom('rotas')
        .selectAll()
        .where('id_cidade_origem', '=', idOriginCity)
        .where('id_cidade_destino', '=', idDestinationCity)
        .limit(1)
        .execute();

      if (result?.created_at) {
        return RouteMapper.toDomain(result);
      }
      return null;
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar a rota entre as cidades de origem ${idOriginCity} e destino ${idDestinationCity}`,
        error,
        'RoutesRepository',
      );
    }
  }

  async findRouteByName(name: string): Promise<Route> {
    try {
      const [result] = await this.db
        .selectFrom('rotas')
        .selectAll()
        .where('nome', '=', name)
        .limit(1)
        .execute();

      if (result?.created_at) {
        return RouteMapper.toDomain(result);
      }
      return null;
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar a rota com o nome ${name}`,
        error,
        'RoutesRepository',
      );
    }
  }
}
