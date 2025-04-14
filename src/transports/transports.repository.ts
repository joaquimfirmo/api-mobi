import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';

type filters = {
  diaSemana: string | null;
  horaPartida: string | null;
  idCidadeOrigem: string | null;
  idCidadeDestino: string | null;
};

@Injectable()
export class TransportsRepository {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly connection: Kysely<Database>,
  ) {}

  async findAll(filters: filters, page: number = 0, limit: number = 25) {
    const { diaSemana, horaPartida, idCidadeDestino, idCidadeOrigem } = filters;

    const whereClause = this.generateWhereClause(
      diaSemana,
      horaPartida,
      idCidadeOrigem,
      idCidadeDestino,
    );

    let query;

    query = this.connection
      .selectFrom('empresas_rotas')
      .innerJoin('empresas', 'empresas_rotas.id_empresa', 'empresas.id')
      .innerJoin('rotas', 'empresas_rotas.id_rota', 'rotas.id')
      .innerJoin('horarios', 'empresas_rotas.id_horario', 'horarios.id')
      .innerJoin('veiculos', 'empresas_rotas.id_veiculo', 'veiculos.id')
      .select([
        'rotas.nome as rota',
        'empresas.nome_fantasia as empresa',
        'rotas.distancia as distancia_km',
        'rotas.tempo_estimado as duracao',
        'veiculos.nome as veiculo',
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

    return rows;
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
