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
      return await this.db.selectFrom('transportes').selectAll().execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar transportes',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.db
        .selectFrom('transportes')
        .selectAll()
        .where('id', '=', id)
        .limit(1)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar transporte por id',
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

  async findByCityId(
    idCity: string,
    page: number = 0,
    limit: number = 20,
    filters: any,
  ) {
    const { day, hour, city_destination } = filters;

    const where = this.generateWhereClause(day, hour, city_destination);

    try {
      let query: any;

      query = this.db
        .selectFrom('transportes')
        .innerJoin('veiculos', 'veiculos.id', 'transportes.id_veiculo')
        .innerJoin('empresas', 'empresas.id', 'transportes.id_empresa')
        .where('transportes.id_cidade', '=', idCity)
        .select([
          'transportes.id',
          'transportes.cidade_origem',
          'transportes.cidade_destino',
          'transportes.dia_semana',
          'transportes.local_origem',
          'transportes.horario_saida',
          'transportes.horario_chegada',
          'transportes.preco',
          'veiculos.nome as veiculo',
          'empresas.nome_fantasia as empresa',
        ])
        .limit(limit)
        .offset(page * limit);

      if (where) {
        query = query.where(where);
      }

      query.compile();

      const { rows } = await this.db.executeQuery(query);

      return rows;
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar transportes',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async create(route: Route) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .insertInto('transportes')
          .values({
            id: route.id,
            cidade_origem: route.originCity,
            cidade_destino: route.destinationCity,
            local_origem: route.originLocation,
            dia_semana: route.dayOfWeek,
            horario_saida: route.departureTime,
            horario_chegada: route.arrivalTime,
            preco: route.price,
            id_veiculo: route.vehicleId,
            id_empresa: route.companyId,
            id_cidade: route.cityId,
          })
          .returning([
            'id',
            'cidade_origem',
            'cidade_destino',
            'local_origem',
            'dia_semana',
            'horario_saida',
            'horario_chegada',
            'preco',
            'id_veiculo',
            'id_empresa',
            'id_cidade',
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

  async update(id: string, route: UpdateRouteDTO) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .updateTable('transportes')
          .set({
            ...(route.originCity && {
              cidade_origem: route.originCity,
            }),
            ...(route.destinationCity && {
              cidade_destino: route.destinationCity,
            }),
            ...(route.originLocation && {
              local_origem: route.originLocation,
            }),
            ...(route.dayOfWeek && { dia_semana: route.dayOfWeek }),
            ...(route.departureTime && {
              horario_saida: route.departureTime,
            }),
            ...(route.arrivalTime && {
              horario_chegada: route.arrivalTime,
            }),
            ...(route.price && { preco: route.price }),
            ...(route.vehicleId && { id_veiculo: route.vehicleId }),
            ...(route.companyId && { id_empresa: route.companyId }),
            ...(route.cityId && { id_cidade: route.cityId }),
            updated_at: sql`now()`,
          })
          .where('id', '=', id)
          .returning([
            'id',
            'cidade_origem',
            'cidade_destino',
            'local_origem',
            'dia_semana',
            'horario_saida',
            'horario_chegada',
            'preco',
            'id_veiculo',
            'id_empresa',
            'id_cidade',
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
        return await trx
          .deleteFrom('transportes')
          .where('id', '=', id)
          .returning(['id'])
          .execute();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao deletar transporte',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAllTransportsByCityId(idCity: string) {
    try {
      return await this.db
        .selectFrom('transportes')
        .selectAll()
        .where('id_cidade', '=', idCity)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar transportes por cidade',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
