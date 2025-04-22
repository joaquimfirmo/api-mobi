import { Injectable, Inject } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';
import { Vehicle } from './entities/vehicle.entity';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll() {
    return await this.db.selectFrom('veiculos').selectAll().execute();
  }

  async findById(id: string) {
    return await this.db
      .selectFrom('veiculos')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .execute();
  }

  async findByName(nome: string) {
    return await this.db
      .selectFrom('veiculos')
      .selectAll()
      .where('nome', '=', nome)
      .limit(1)
      .execute();
  }

  async create(vehicle: Vehicle) {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .insertInto('veiculos')
        .values({
          id: vehicle.id,
          nome: vehicle.nome,
        })
        .returning(['id', 'nome', 'created_at', 'updated_at'])
        .execute();
    });
  }

  async update(id: string, vehicle: UpdateVehicleDto) {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .updateTable('veiculos')
        .set({
          nome: vehicle.nome,
          updated_at: sql`now()`,
        })
        .where('id', '=', id)
        .returning(['id', 'nome', 'created_at', 'updated_at'])
        .executeTakeFirstOrThrow();
    });
  }

  async delete(id: string) {
    return await this.db.transaction().execute(async (trx) => {
      return await trx
        .deleteFrom('veiculos')
        .where('id', '=', id)
        .returning(['id'])
        .executeTakeFirstOrThrow();
    });
  }
}
