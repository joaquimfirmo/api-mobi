import {
  Injectable,
  Inject,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';
import { Vehicle } from './entities/vehicle.entity';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll() {
    try {
      return await this.db.selectFrom('veiculos').selectAll().execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar veículos',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.db
        .selectFrom('veiculos')
        .selectAll()
        .where('id', '=', id)
        .limit(1)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar veículo por id',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async create(vehicle: Vehicle) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao criar veículo',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: string, vehicle: UpdateVehicleDto) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao atualizar veículo',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async delete(id: string) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .deleteFrom('veiculos')
          .where('id', '=', id)
          .returning(['id'])
          .executeTakeFirstOrThrow();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao deletar veículo',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
