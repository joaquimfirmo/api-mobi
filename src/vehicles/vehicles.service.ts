import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesRepository } from './vehicles.repository';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly logger: Logger,
    private readonly vehicleRepository: VehiclesRepository,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    this.logger.log(`Criando veículo: ${JSON.stringify(createVehicleDto)}`);

    const vehicleExists = await this.verifyVehicleExist({
      nome: createVehicleDto.nome,
    });

    if (vehicleExists) {
      this.logger.error(
        `Veículo com o nome: ${createVehicleDto.nome} já existe`,
      );
      throw new BadRequestException(
        `Veículo com o nome: ${createVehicleDto.nome} já existe`,
      );
    }

    const vehicle = new Vehicle(createVehicleDto.nome);

    try {
      const [result] = await this.vehicleRepository.create(vehicle);
      this.logger.log(
        `Veículo: ${JSON.stringify(createVehicleDto)} criado com sucesso`,
      );
      return new Vehicle(
        result.nome,
        result.id,
        result.created_at,
        result.updated_at,
      );
    } catch (error) {
      this.logger.error('Erro ao criar veículo', error);
      throw new InternalServerErrorException(
        `Erro interno ao tentar salvar o veículo`,
      );
    }
  }

  findAll(): Promise<Vehicle[]> {
    try {
      return this.vehicleRepository.findAll();
    } catch (error) {
      this.logger.error('Erro ao buscar veículos', error);
      throw new InternalServerErrorException(
        `Erro interno ao tentar buscar os veículos`,
      );
    }
  }

  async findOne(id: string): Promise<Vehicle> {
    try {
      const [vehicle] = await this.vehicleRepository.findById(id);
      if (!vehicle) {
        throw new NotFoundException(
          `Veículo com o ID:${id} informado não foi encontrado`,
        );
      }

      return new Vehicle(
        vehicle.nome,
        vehicle.id,
        vehicle.created_at,
        vehicle.updated_at,
      );
    } catch (error) {
      this.logger.error('Erro ao buscar veículo', error);
      throw new InternalServerErrorException(
        `Erro interno ao tentar buscar o veículo com o ID: ${id}`,
      );
    }
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicleExists = await this.verifyVehicleExist({
      id,
    });
    if (!vehicleExists) {
      this.logger.error(`Veículo com o ID:${id} informado não foi encontrado`);
      throw new NotFoundException(
        `Veículo com o ID:${id} informado não foi encontrado`,
      );
    }

    try {
      this.logger.log(`Atualizando veículo com id: ${id}`);
      const updatedVehicle = await this.vehicleRepository.update(
        id,
        updateVehicleDto,
      );
      this.logger.log(`Veículo com id: ${id} atualizado com sucesso`);
      return updatedVehicle;
    } catch (error) {
      this.logger.error(`Erro ao atualizar veículo com id: ${id}`, error);
      throw new InternalServerErrorException(
        `Erro interno ao tentar atualizar o veículo com o ID: ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    const vehicleExists = await this.verifyVehicleExist({
      id,
    });
    if (!vehicleExists) {
      this.logger.error(`Veículo com o ID:${id} informado não foi encontrado`);
      throw new NotFoundException(
        `Veículo com o ID:${id} informado não foi encontrado`,
      );
    }
    this.logger.log(`Removendo veículo com id: ${id}`);

    try {
      await this.vehicleRepository.delete(id);
      this.logger.log(`Veículo com id: ${id} removido com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao remover veículo com id: ${id}`, error);
      throw new InternalServerErrorException(
        `Erro interno ao tentar remover o veículo com o ID: ${id}`,
      );
    }
  }

  private async verifyVehicleExist(criteria: {
    id?: string;
    nome?: string;
  }): Promise<boolean> {
    if (criteria.id) {
      return await this.checkVehicleById(criteria.id);
    }

    if (criteria.nome) {
      return await this.checkVehicleByName(criteria.nome);
    }

    return false;
  }

  private async checkVehicleById(id: string): Promise<boolean> {
    const vehicle = await this.vehicleRepository.findById(id);
    return vehicle.length > 0;
  }

  private async checkVehicleByName(nome: string): Promise<boolean> {
    const vehicleExists = await this.vehicleRepository.findByName(nome);
    return vehicleExists.length > 0;
  }
}
