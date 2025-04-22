import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Permissoes } from 'src/common/database/types';

interface UserResponse {
  id: string;
  nome: string;
  email: string;
  permissoes: Permissoes;
  created_at: Date | string;
  updated_at: Date | string;
}

@Injectable()
export class UsersService {
  constructor(
    private logger: Logger,
    private usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = new User(
      createUserDto.nome,
      createUserDto.email,
      createUserDto.senha,
      createUserDto.permissoes,
    );

    const emailExists = await this.usersRepository.findByEmail(user.email);

    if (emailExists.length > 0) {
      throw new BadRequestException(
        'Email informado é inválido ou já está em uso no sistema',
      );
    }

    this.logger.log(
      `Criando usuário: ${JSON.stringify({
        nome: user.name,
        email: user.email,
        permissoes: user.permissions,
      })}`,
    );

    const [newUser] = await this.usersRepository.create(user);

    const userResponse: UserResponse = {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      permissoes: newUser.permissoes,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };

    this.logger.log(`Usuário criado: ${JSON.stringify(userResponse)}`);

    return userResponse;
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.usersRepository.findAll();
    const usersResponse: UserResponse[] = users.map((user) => {
      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        permissoes: user.permissoes,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });

    return usersResponse;
  }

  async findOne(id: string): Promise<any> {
    this.logger.log(`Buscando usuário com ID: ${id}`);
    const result = await this.usersRepository.findById(id);
    if (result.length === 0) {
      throw new NotFoundException(
        `Usuário com o ID:${id} informado não foi encontrado`,
      );
    }

    const [user] = result;

    const userResponse: UserResponse = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      permissoes: user.permissoes,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return userResponse;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Atualizando usuário com ID: ${id}`);
    this.logger.log(`Dados para atualização: ${JSON.stringify(updateUserDto)}`);
    const userExist = await this.usersRepository.findById(id);

    if (userExist.length === 0) {
      throw new NotFoundException(
        `Usuário com o ID:${id} informado não foi encontrado`,
      );
    }

    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    this.logger.log(`Excluindo usuário com ID: ${id}`);
    const userExist = await this.usersRepository.findById(id);

    if (userExist.length === 0) {
      throw new NotFoundException(
        `Usuário para exclusão com o ID:${id} informado  não foi encontrado`,
      );
    }

    return this.usersRepository.delete(id);
  }
}
