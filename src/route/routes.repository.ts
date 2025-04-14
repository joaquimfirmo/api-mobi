import {
  Injectable,
  Inject,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';
import { Route } from './entities/route.entity';
import { UpdateRouteDTO } from './dto/update-route.dto';

@Injectable()
export class RoutesRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll() {
    try {
      return await this.db.selectFrom('rotas').selectAll().execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar rotas',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.db
        .selectFrom('rotas')
        .selectAll()
        .where('id', '=', id)
        .limit(1)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar rota por id',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  generateWhereClause = (day, hour, city_destination) => {
    const conditions = [];

    if (day) {
      conditions.push(sql`dia_semana = ${day}`);
    }
    if (hour) {
      conditions.push(sql`horario_saida = ${hour}`);
    }
    if (city_destination) {
      conditions.push(sql`cidade_destino = ${city_destination}`);
    }

    return conditions.length > 0 ? sql.join(conditions, sql` AND `) : null;
  };

  async create(route: Route) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .insertInto('rotas')
          .values({
            id: route.id,
            nome: route.name,
            id_cidade_origem: route.idOriginCity,
            id_cidade_destino: route.idDestinationCity,
            distancia: route.distance,
            tempo_estimado: route.estimatedTime,
            local: route.originLocation,
          })
          .returning([
            'id',
            'nome',
            'id_cidade_origem',
            'id_cidade_destino',
            'distancia',
            'tempo_estimado',
            'local',
            'created_at',
            'updated_at',
          ])
          .execute();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao criar transporte',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findRouteByCities(idOriginCity: string, idDestinationCity: string) {
    try {
      return await this.db
        .selectFrom('rotas')
        .selectAll()
        .where('id_cidade_origem', '=', idOriginCity)
        .where('id_cidade_destino', '=', idDestinationCity)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar rota por cidades',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findRouteByName(name: string) {
    try {
      return await this.db
        .selectFrom('rotas')
        .selectAll()
        .where('nome', '=', name)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar rota por nome',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: string, route: UpdateRouteDTO) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .updateTable('rotas')
          .set({
            ...(route.nome && { nome: route.nome }),
            ...(route.idCidadeOrigem && {
              cidade_origem: route.idCidadeOrigem,
            }),
            ...(route.idCidadeDestino && {
              cidade_destino: route.idCidadeDestino,
            }),
            ...(route.distancia && { distancia: route.distancia }),
            ...(route.tempoEstimado && {
              tempo_estimado: route.tempoEstimado,
            }),
            ...(route.localOrigem && { local: route.localOrigem }),
            updated_at: sql`now()`,
          })
          .where('id', '=', id)
          .returning([
            'id',
            'nome',
            'id_cidade_origem',
            'id_cidade_destino',
            'distancia',
            'tempo_estimado',
            'local',
            'created_at',
            'updated_at',
          ])
          .execute();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao atualizar transporte',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async delete(id: string) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx.deleteFrom('rotas').where('id', '=', id).execute();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao deletar rotas',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAllTransportsOptionsByRoute(name: string) {
    try {
      return await this.db
        .selectFrom('empresas_rotas')
        .innerJoin('empresas', 'empresas_rotas.id_empresa', 'empresas.id')
        .innerJoin('rotas', 'empresas_rotas.id_rota', 'rotas.id')
        .innerJoin('horarios', 'empresas_rotas.id_horario', 'horarios.id')
        .innerJoin('veiculos', 'empresas_rotas.id_veiculo', 'veiculos.id')
        .where('rotas.nome', '=', name)
        .select([
          'rotas.nome as rota',
          'empresas.nome_fantasia as empresa',
          'rotas.distancia as distancia_km',
          'rotas.tempo_estimado as duracao',
          'veiculos.nome as veiculo',
          'horarios.hora_partida as horario_saida',
          'horarios.hora_chegada as horario_chegada',
        ])
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar transportes por nome da rota',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
