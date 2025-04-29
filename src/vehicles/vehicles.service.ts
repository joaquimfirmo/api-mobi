import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
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

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.getVehicleById(id);
    return new Vehicle(
      vehicle.nome,
      vehicle.id,
      vehicle.created_at,
      vehicle.updated_at,
    );
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    this.logger.log(`Criando veículo: ${JSON.stringify(createVehicleDto)}`);

    await this.ensureVehicleDoesNotExist(createVehicleDto);

    const vehicle = new Vehicle(createVehicleDto.nome);

    const result = await this.vehicleRepository.create(vehicle);
    this.logger.log(
      `Veículo: ${JSON.stringify(createVehicleDto)} criado com sucesso`,
    );
    return new Vehicle(
      result.nome,
      result.id,
      result.created_at,
      result.updated_at,
    );
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    await this.getVehicleById(id);

    this.logger.log(`Atualizando veículo com id: ${id}`);
    const updatedVehicle = await this.vehicleRepository.update(
      id,
      updateVehicleDto,
    );
    this.logger.log(`Veículo com id: ${id} atualizado com sucesso`);
    return updatedVehicle;
  }

  async remove(id: string): Promise<void> {
    await this.getVehicleById(id);

    this.logger.log(`Removendo veículo com id: ${id}`);

    await this.vehicleRepository.delete(id);
    this.logger.log(`Veículo com id: ${id} removido com sucesso`);
    return;
  }

  private async checkVehicleByName(nome: string): Promise<boolean> {
    const vehicleExists = await this.vehicleRepository.findByName(nome);
    return !!vehicleExists;
  }

  private async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      this.logger.error(`Veículo com o ID:${id}, informado não foi encontrado`);
      throw new NotFoundException(
        `Veículo com o ID:${id}, informado não foi encontrado`,
      );
    }
    return vehicle;
  }

  private async ensureVehicleDoesNotExist(
    createVehicleDto: CreateVehicleDto,
  ): Promise<void> {
    const vehicleExists = await this.checkVehicleByName(createVehicleDto.nome);
    if (vehicleExists) {
      this.logger.error(
        `Veículo com o nome:${createVehicleDto.nome}, já existe`,
      );
      throw new BadRequestException(
        `Veículo com o nome:${createVehicleDto.nome}, já existe`,
      );
    }
  }
}
