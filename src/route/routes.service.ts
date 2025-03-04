import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Route } from './entities/route.entity';
import { CreateRouteDTO } from './dto/create-route.dto';
import { UpdateRouteDTO } from './dto/update-route.dto';
import { RoutesRepository } from './routes.repository';

@Injectable()
export class RoutesService {
  constructor(
    private readonly logger: Logger,
    private readonly transportsRepository: RoutesRepository,
  ) {}

  async findAll(): Promise<Route[]> {
    const transports = await this.transportsRepository.findAll();
    if (transports.length === 0) {
      throw new NotFoundException('Nenhum transporte foi encontrado');
    }

    return transports.map(
      (transport) =>
        new Route(
          transport.cidade_origem,
          transport.cidade_destino,
          transport.local_origem,
          transport.dia_semana,
          transport.horario_saida,
          transport.horario_chegada,
          transport.preco,
          transport.id_empresa,
          transport.id_veiculo,
          transport.id_cidade,
          transport.id,
          transport.created_at,
          transport.updated_at,
        ),
    );
  }

  async findOne(id: string): Promise<Route> {
    const result = await this.transportsRepository.findById(id);
    if (result.length === 0) {
      throw new NotFoundException(
        `Transporte com o ID:${id} informado não foi encontrado`,
      );
    }
    const [transport] = result;

    return new Route(
      transport.cidade_origem,
      transport.cidade_destino,
      transport.local_origem,
      transport.dia_semana,
      transport.horario_saida,
      transport.horario_chegada,
      transport.preco,
      transport.id_veiculo,
      transport.id_empresa,
      transport.id_cidade,
      transport.id,
      transport.created_at,
      transport.updated_at,
    );
  }

  async findTransportsByCity(cityId: string, query): Promise<any> {
    const { page, limit, day, hour, city_destination } = query;
    const transports = await this.transportsRepository.findByCityId(
      cityId,
      page,
      limit,
      { day, hour, city_destination },
    );
    if (transports.length === 0) {
      throw new NotFoundException(
        `Nenhum transporte foi encontrado para a cidade com o ID:${cityId}`,
      );
    }

    return transports;
  }

  async create(createRouteDTO: CreateRouteDTO): Promise<Route> {
    this.logger.log(`Criando transporte: ${JSON.stringify(CreateRouteDTO)}`);

    const transport = new Route(
      createRouteDTO.originCity,
      createRouteDTO.destinationCity,
      createRouteDTO.originLocation,
      createRouteDTO.dayOfWeek,
      createRouteDTO.departureTime,
      createRouteDTO.arrivalTime,
      createRouteDTO.price,
      createRouteDTO.vehicleId,
      createRouteDTO.companyId,
      createRouteDTO.cityId,
    );
    const result = await this.transportsRepository.create(transport);

    const [createdTransport] = result;
    this.logger.log(`Transporte criado: ${JSON.stringify(createdTransport)}`);

    return new Route(
      createdTransport.cidade_origem,
      createdTransport.cidade_destino,
      createdTransport.local_origem,
      createdTransport.dia_semana,
      createdTransport.horario_saida,
      createdTransport.horario_chegada,
      createdTransport.preco,
      createdTransport.id_veiculo,
      createdTransport.id_empresa,
      createdTransport.id_cidade,
      createdTransport.id,
      createdTransport.created_at,
      createdTransport.updated_at,
    );
  }
  async update(id: string, updateRouteDTO: UpdateRouteDTO): Promise<Route> {
    const transportForUpdateExisting =
      await this.transportsRepository.findById(id);

    this.logger.log(
      `Transporte para atualização: ${JSON.stringify(transportForUpdateExisting)}`,
    );

    if (transportForUpdateExisting.length === 0) {
      throw new NotFoundException(
        `Transporte com o ID:${id} informado não foi encontrado`,
      );
    }

    const transport = new Route(
      updateRouteDTO.originCity,
      updateRouteDTO.destinationCity,
      updateRouteDTO.originLocation,
      updateRouteDTO.dayOfWeek,
      updateRouteDTO.departureTime,
      updateRouteDTO.arrivalTime,
      updateRouteDTO.price,
      updateRouteDTO.vehicleId,
      updateRouteDTO.companyId,
      updateRouteDTO.cityId,
    );

    const result = await this.transportsRepository.update(id, transport);

    const [updatedTransport] = result;

    this.logger.log(
      `Transporte atualizado: ${JSON.stringify(updatedTransport)}`,
    );

    return new Route(
      updatedTransport.cidade_origem,
      updatedTransport.cidade_destino,
      updatedTransport.local_origem,
      updatedTransport.dia_semana,
      updatedTransport.horario_saida,
      updatedTransport.horario_chegada,
      updatedTransport.preco,
      updatedTransport.id_veiculo,
      updatedTransport.id_empresa,
      updatedTransport.id_cidade,
      updatedTransport.id,
      updatedTransport.created_at,
      updatedTransport.updated_at,
    );
  }

  async remove(id: string) {
    this.logger.log(`Excluindo transporte com o ID:${id}`);
    const transportExists = await this.transportsRepository.findById(id);

    if (transportExists.length === 0) {
      throw new NotFoundException(
        `Transporte para exclusão com o ID:${id} informado não foi encontrado`,
      );
    }

    return this.transportsRepository.delete(id);
  }
}
