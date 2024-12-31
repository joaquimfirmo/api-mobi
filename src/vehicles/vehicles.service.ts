import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    const vehicle = new Vehicle(createVehicleDto.nome);
    this.logger.log(
      `Veículo: ${JSON.stringify(createVehicleDto)} criado com sucesso`,
    );
    const result = await this.vehicleRepository.create(vehicle);
    return new Vehicle(
      result[0].nome,
      result[0].id,
      result[0].created_at,
      result[0].updated_at,
    );
  }

  findAll(): Promise<Vehicle[]> {
    this.logger.log('Buscando todos os veículos');
    return this.vehicleRepository.findAll();
  }

  async findOne(id: string): Promise<Vehicle> {
    this.logger.log(`Buscando veículo com id: ${id}`);
    const result = await this.vehicleRepository.findById(id);
    if (result.length === 0) {
      throw new NotFoundException(
        `Veículo com o ID:${id} informado não foi encontrado`,
      );
    }

    return new Vehicle(
      result[0].nome,
      result[0].id,
      result[0].created_at,
      result[0].updated_at,
    );
  }

  update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    this.logger.log(`Atualizando veículo com id: ${id}`);
    return this.vehicleRepository.update(id, updateVehicleDto);
  }

  remove(id: string) {
    this.logger.log(`Removendo veículo com id: ${id}`);
    return this.vehicleRepository.delete(id);
  }
}
