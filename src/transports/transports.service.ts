import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TransportsRepository } from './transports.repository';
import { CompanyRepository } from '../company/company.repository';
import { RoutesRepository } from '../route/routes.repository';
import { ScheduleRepository } from '../schedule/schedule.repository';
import { VehiclesRepository } from '../vehicles/vehicles.repository';
import { TransportFilters } from './types/transports.types';
import { Transports } from './entities/transports.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { CompanyRouteSchedule } from './entities/company-route-schedule.entity';
import { TransportsMapper } from './mapper/transports.mapper';
@Injectable()
export class TransportsService {
  constructor(
    private readonly logger: Logger,
    private readonly transportsRepository: TransportsRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly routesRepository: RoutesRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly vehiclesRepository: VehiclesRepository,
  ) {}
  async findAll(
    filters: TransportFilters,
    page: number,
    limit: number,
  ): Promise<Transports[]> {
    this.logger.log(
      `Fetching transports with filters: ${JSON.stringify(filters)}`,
    );

    const result = await this.transportsRepository.findAll(
      filters,
      page,
      limit,
    );

    if (!result || result.length === 0) {
      this.logger.warn(
        `No transports found for filters: ${JSON.stringify(filters)}`,
      );
      return [];
    }

    this.logger.log(
      `Found ${result.length} transports for filters: ${JSON.stringify(filters)}`,
    );

    return result;
  }

  async create(transport: CreateTransportDto): Promise<any> {
    const { empresaId, rotaId, horarioId, veiculoId, precoPassagem } =
      transport;

    await this.validateIds(empresaId, rotaId, horarioId, veiculoId);

    await this.ensureTransportDoesNotExist(transport);

    const transportRecord = new CompanyRouteSchedule(
      empresaId,
      rotaId,
      horarioId,
      veiculoId,
      precoPassagem,
    );

    this.logger.log(
      `Criando transporte: Empresa: ${empresaId}, Rota: ${rotaId}, Horário: ${horarioId}, Veículo: ${veiculoId}, Preço: ${precoPassagem}`,
    );

    return await this.transportsRepository.create(
      TransportsMapper.toPersistence(transportRecord),
    );
  }

  private async validateIds(
    companyId: string,
    routeId: string,
    scheduleId: string,
    vehicleId: string,
  ): Promise<void> {
    this.logger.log(
      `Validando IDs - Empresa: ${companyId}, Rota: ${routeId}, Horário: ${scheduleId}, Veículo: ${vehicleId}`,
    );

    const validations = [
      {
        id: companyId,
        repository: this.companyRepository,
        entityName: 'Empresa',
      },
      {
        id: routeId,
        repository: this.routesRepository,
        entityName: 'Rota',
      },
      {
        id: scheduleId,
        repository: this.scheduleRepository,
        entityName: 'Horário',
      },
      {
        id: vehicleId,
        repository: this.vehiclesRepository,
        entityName: 'Veículo',
      },
    ];

    for (const { id, repository, entityName } of validations) {
      const exists = await repository.findById(id);
      if (!exists || (Array.isArray(exists) && exists.length === 0)) {
        this.logger.error(
          `${entityName} com ID ${id} não existe`,
          `TransportsService.validateIds`,
        );
        throw new NotFoundException(`${entityName} com ID ${id} não existe`);
      }
    }

    return;
  }

  private async ensureTransportDoesNotExist(
    createTransportDto: CreateTransportDto,
  ): Promise<void> {
    const { empresaId, rotaId, horarioId, veiculoId } = createTransportDto;

    this.logger.log(
      `Verificando se transporte já existe para os IDs: Empresa: ${empresaId}, Rota: ${rotaId}, Horário: ${horarioId}, Veículo: ${veiculoId}`,
    );
    const transportExists = await this.transportsRepository.exists(
      empresaId,
      rotaId,
      horarioId,
      veiculoId,
    );
    if (transportExists) {
      this.logger.error(
        `Transporte já existe para os IDs informados: ${JSON.stringify(createTransportDto)}`,
        `TransportsService.ensureTransportDoesNotExist`,
      );
      throw new BadRequestException(
        `Transporte já existe para os IDs informados`,
      );
    }
    this.logger.log(
      `Transporte não existe, prosseguindo com a criação: ${JSON.stringify(createTransportDto)}`,
    );

    return;
  }
}
