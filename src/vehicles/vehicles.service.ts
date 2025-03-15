import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleRepository } from './vehicles.repository';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly logger: Logger,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    this.logger.log(`Criando veículo: ${JSON.stringify(createVehicleDto)}`);

    const vehicleExists = await this.vehicleRepository.findByName(
      createVehicleDto.nome,
    );
    if (vehicleExists.length > 0) {
      this.logger.warn(
        `Veículo com o nome: ${createVehicleDto.nome} já existe`,
      );
      throw new BadRequestException(
        `Veículo com o nome: ${createVehicleDto.nome} já existe`,
      );
    }
    const vehicle = new Vehicle(createVehicleDto.nome);
    this.logger.log(
      `Veículo: ${JSON.stringify(createVehicleDto)} criado com sucesso`,
    );
    const [result] = await this.vehicleRepository.create(vehicle);
    return new Vehicle(
      result.nome,
      result.id,
      result.created_at,
      result.updated_at,
    );
  }

  findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }

  async findOne(id: string): Promise<Vehicle> {
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
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicleExists = await this.vehicleRepository.findById(id);
    if (vehicleExists.length === 0) {
      this.logger.warn(`Veículo com o ID: ${id} não foi encontrado`);
      throw new NotFoundException(
        `Veículo com o ID:${id} informado não foi encontrado`,
      );
    }
    this.logger.log(`Atualizando veículo com id: ${id}`);
    return this.vehicleRepository.update(id, updateVehicleDto);
  }

  async remove(id: string) {
    const vehicleExists = await this.vehicleRepository.findById(id);
    if (vehicleExists.length === 0) {
      this.logger.warn(`Veículo com o ID: ${id} não foi encontrado`);
      throw new NotFoundException(
        `Veículo com o ID:${id} informado não foi encontrado`,
      );
    }

    this.logger.log(`Removendo veículo com id: ${id}`);
    return this.vehicleRepository.delete(id);
  }
}
