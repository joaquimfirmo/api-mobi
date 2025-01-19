import {
  Injectable,
  Inject,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { Database } from 'src/common/database/types';
import User from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DATABASE_CONNECTION') private db: Kysely<Database>) {}

  async findAll() {
    try {
      return await this.db
        .selectFrom('usuarios')
        .select([
          'id',
          'nome',
          'email',
          'permissoes',
          'created_at',
          'updated_at',
        ])
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar usuários',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findById(id: string) {
    try {
      return await this.db
        .selectFrom('usuarios')
        .select([
          'id',
          'nome',
          'email',
          'permissoes',
          'created_at',
          'updated_at',
        ])
        .where('id', '=', id)
        .limit(1)
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao buscar usuário por id',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async create(user: User) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .insertInto('usuarios')
          .values({
            id: user.id,
            nome: user.name,
            email: user.email,
            senha: user.password,
            permissoes: user.permissions,
          })
          .returning([
            'id',
            'nome',
            'email',
            'permissoes',
            'created_at',
            'updated_at',
          ])
          .execute();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao criar usuário',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .updateTable('usuarios')
          .set({
            ...(user.nome && { nome: user.nome }),
            ...(user.email && { email: user.email }),
            ...(user.permissoes && { permissoes: user.permissoes }),
            updated_at: sql`now()`,
          })
          .where('id', '=', id)
          .returning([
            'id',
            'nome',
            'email',
            'permissoes',
            'created_at',
            'updated_at',
          ])
          .execute();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao atualizar usuário',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async delete(id: string) {
    try {
      return await this.db.transaction().execute(async (trx) => {
        return await trx
          .deleteFrom('usuarios')
          .where('id', '=', id)
          .returning(['id'])
          .execute();
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: 'Erro ao deletar usuário',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
