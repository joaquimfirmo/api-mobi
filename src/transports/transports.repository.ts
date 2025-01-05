import {
  Injectable,
  Inject,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';
import { Transport } from './entities/transport.entity';

@Injectable()
export class TransportsRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll() {
    try {
      return await this.db
        .selectFrom('transportes')
        .innerJoin('veiculos', 'veiculos.id', 'transportes.id_veiculo')
        .innerJoin('empresas', 'empresas.id', 'transportes.id_empresa')
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
        .execute();
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

  async create(transport: Transport) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .insertInto('transportes')
          .values({
            id: transport.id,
            cidade_origem: transport.cidadeOrigem,
            cidade_destino: transport.cidadeDestino,
            local_origem: transport.localOrigem,
            dia_semana: transport.diaSemana,
            horario_saida: transport.horarioSaida,
            horario_chegada: transport.horarioChegada,
            preco: transport.preco,
            id_veiculo: transport.idVeiculo,
            id_empresa: transport.idEmpresa,
            id_cidade: transport.idCidade,
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

  async update(id: string, transport: Transport) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .updateTable('transportes')
          .set({
            ...(transport.cidadeOrigem && {
              cidade_origem: transport.cidadeOrigem,
            }),
            ...(transport.cidadeDestino && {
              cidade_destino: transport.cidadeDestino,
            }),
            ...(transport.localOrigem && {
              local_origem: transport.localOrigem,
            }),
            ...(transport.diaSemana && { dia_semana: transport.diaSemana }),
            ...(transport.horarioSaida && {
              horario_saida: transport.horarioSaida,
            }),
            ...(transport.horarioChegada && {
              horario_chegada: transport.horarioChegada,
            }),
            ...(transport.preco && { preco: transport.preco }),
            ...(transport.idVeiculo && { id_veiculo: transport.idVeiculo }),
            ...(transport.idEmpresa && { id_empresa: transport.idEmpresa }),
            ...(transport.idCidade && { id_cidade: transport.idCidade }),
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
