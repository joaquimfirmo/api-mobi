import { Vehicle } from '../entities/vehicle.entity';
import { Vehicles as VehiclesRecord } from '../../common/database/types';

export class VehicleMapper {
  static toDomain(vehicleRecord: VehiclesRecord): Vehicle {
    return new Vehicle(
      vehicleRecord.nome,
      vehicleRecord.id,
      vehicleRecord.created_at,
      vehicleRecord.updated_at,
    );
  }

  static toPersistence(vehicle: Partial<Vehicle>): VehiclesRecord {
    return {
      id: vehicle.id,
      nome: vehicle.nome,
      created_at: vehicle.createdAt ? new Date(vehicle.createdAt) : null,
      updated_at: vehicle.updatedAt ? new Date(vehicle.updatedAt) : null,
    };
  }
}
