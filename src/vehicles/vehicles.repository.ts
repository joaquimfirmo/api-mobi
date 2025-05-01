import { Injectable, Inject } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database, Vehicles } from 'src/common/database/types';
import { DatabaseException } from '../common/execptions/database.execption';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleMapper } from './mapper/vehicles.mapper';

@Injectable()
export class VehiclesRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll(): Promise<Vehicle[]> {
    try {
      const result: Vehicles[] = await this.db
        .selectFrom('veiculos')
        .selectAll()
        .execute();

      return result.map((vehicle) => {
        return VehicleMapper.toDomain(vehicle);
      });
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar veículos`,
        error,
        'VehiclesRepository.findAll',
      );
    }
  }

  async findById(id: string): Promise<Vehicle | null> {
    try {
      const [result] = await this.db
        .selectFrom('veiculos')
        .selectAll()
        .where('id', '=', id)
        .limit(1)
        .execute();

      return result ? VehicleMapper.toDomain(result) : null;
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar veículo com o id ${id}`,
        error,
        'VehiclesRepository.findById',
      );
    }
  }

  async findByName(nome: string): Promise<Vehicle | null> {
    try {
      const [result] = await this.db
        .selectFrom('veiculos')
        .selectAll()
        .where('nome', '=', nome)
        .limit(1)
        .execute();

      return result ? VehicleMapper.toDomain(result) : null;
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível buscar veículo com o nome ${nome}`,
        error,
        'VehiclesRepository.findByName',
      );
    }
  }

  async create(vehicle: Partial<Vehicles>): Promise<Vehicle> {
    try {
      const [result] = await this.db.transaction().execute(async (trx) => {
        return await trx
          .insertInto('veiculos')
          .values({
            id: vehicle.id,
            nome: vehicle.nome,
          })
          .returningAll()
          .execute();
      });

      return VehicleMapper.toDomain(result);
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível criar veículo com o nome ${vehicle.nome}`,
        error,
        'VehiclesRepository.create',
      );
    }
  }

  async update(id: string, vehicle: Partial<Vehicles>): Promise<Vehicle> {
    try {
      const result = await this.db.transaction().execute(async (trx) => {
        return await trx
          .updateTable('veiculos')
          .set({
            nome: vehicle.nome,
            updated_at: sql`now()`,
          })
          .where('id', '=', id)
          .returningAll()
          .executeTakeFirstOrThrow();
      });

      return VehicleMapper.toDomain(result);
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível atualizar veículo com o ID ${id}`,
        error,
        'VehiclesRepository.update',
      );
    }
  }

  async delete(id: string) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .deleteFrom('veiculos')
          .where('id', '=', id)
          .returning(['id'])
          .execute();
      });
    } catch (error) {
      throw new DatabaseException(
        `Não foi possível deletar veículo com o ID ${id}`,
        error,
        'VehiclesRepository.delete',
      );
    }
  }
}
