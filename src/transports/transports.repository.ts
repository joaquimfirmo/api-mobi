import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import {
  Database,
  TransportsRecord,
  Transports as TransportRecordSave,
} from 'src/common/database/types';
import { DatabaseException } from '../common/execptions/database.execption';
import { TransportFilters } from './types/transports.types';
import { Transports } from './entities/transports.entity';
import { TransportsMapper } from './mapper/transports.mapper';

@Injectable()
export class TransportsRepository {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly connection: Kysely<Database>,
  ) {}

  async findAll(
    filters: TransportFilters,
    page: number = 0,
    limit: number = 25,
  ): Promise<Transports[]> {
    try {
      const { diaSemana, horaPartida, idCidadeDestino, idCidadeOrigem } =
        filters;

      const whereClause = this.generateWhereClause(
        diaSemana,
        horaPartida,
        idCidadeOrigem,
        idCidadeDestino,
      );

      let query;

      query = this.connection
        .selectFrom('empresas_rotas_horarios')
        .innerJoin(
          'empresas',
          'empresas_rotas_horarios.id_empresa',
          'empresas.id',
        )
        .innerJoin('rotas', 'empresas_rotas_horarios.id_rota', 'rotas.id')
        .innerJoin(
          'horarios',
          'empresas_rotas_horarios.id_horario',
          'horarios.id',
        )
        .innerJoin(
          'veiculos',
          'empresas_rotas_horarios.id_veiculo',
          'veiculos.id',
        )
        .select([
          'rotas.nome as rota',
          'empresas.nome_fantasia as empresa',
          'empresas_rotas_horarios.preco_passagem as preco',
          'rotas.distancia as distancia_km',
          'rotas.tempo_estimado as duracao',
          'rotas.via_principal as via_principal',
          'veiculos.nome as veiculo',
          'horarios.dia_semana as dia_semana',
          'horarios.hora_partida as horario_partida',
          'horarios.hora_chegada as horario_chegada',
        ])
        .limit(limit)
        .offset(page * limit);

      if (whereClause) {
        query = query.where(whereClause);
      }

      query.compile();

      const { rows } = await this.connection.executeQuery(query);
      if (!rows || rows.length === 0) {
        return [];
      }

      return rows.map((record) =>
        TransportsMapper.toDomain(record as TransportsRecord),
      );
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar transportes`,
        error,
        'TransportsRepository.findAll',
      );
    }
  }

  async create(transport: Partial<TransportRecordSave>): Promise<any> {
    try {
      const record = await this.connection
        .transaction()
        .execute(async (trx) => {
          return await trx
            .insertInto('empresas_rotas_horarios')
            .values({
              id: transport.id,
              id_empresa: transport.id_empresa,
              id_rota: transport.id_rota,
              id_horario: transport.id_horario,
              id_veiculo: transport.id_veiculo,
              preco_passagem: transport.preco_passagem,
            })
            .returning([
              'id',
              'id_empresa',
              'id_rota',
              'id_horario',
              'id_veiculo',
              'preco_passagem',
              'created_at',
              'updated_at',
            ])
            .executeTakeFirstOrThrow();
        });

      return record;
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível criar o transporte`,
        error,
        'TransportsRepository.create',
      );
    }
  }

  async exists(
    idEmpresa: string,
    idRota: string,
    idHorario: string,
    idVeiculo: string,
  ): Promise<boolean> {
    try {
      const result = await this.connection
        .selectFrom('empresas_rotas_horarios')
        .select('id')
        .where('id_empresa', '=', idEmpresa)
        .where('id_rota', '=', idRota)
        .where('id_horario', '=', idHorario)
        .where('id_veiculo', '=', idVeiculo)
        .executeTakeFirst();
      return !!result;
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível verificar a existência do transporte`,
        error,
        'TransportsRepository.exists',
      );
    }
  }

  private generateWhereClause(
    day: string | null,
    departureTime: string | null,
    idCityOrigin: string | null,
    idCityDestination: string | null,
  ) {
    const conditions = [
      day ? sql`dia_semana = ${day}` : null,
      departureTime ? sql`hora_partida = ${departureTime}` : null,
      idCityOrigin ? sql`id_cidade_origem = ${idCityOrigin}` : null,
      idCityDestination ? sql`id_cidade_destino = ${idCityDestination}` : null,
    ].filter(Boolean);

    return conditions.length > 0 ? sql.join(conditions, sql` AND `) : null;
  }
}
