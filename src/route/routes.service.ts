import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Route } from './entities/route.entity';
import { CreateRouteDTO } from './dto/create-route.dto';
import { UpdateRouteDTO } from './dto/update-route.dto';
// import { TransportOptionDTO } from './dto/transport-option.dto';
import { RoutesRepository } from './routes.repository';
import { Routes } from '../common/database/types';
import { RouteMapper } from './mapper/route.mapper';

@Injectable()
export class RoutesService {
  constructor(
    private readonly logger: Logger,
    private readonly routesRepository: RoutesRepository,
  ) {}

  async findAll(
    filters: Partial<Routes>,
    page: number,
    limit: number,
  ): Promise<Route[]> {
    const persistenceFilters = RouteMapper.toPersistence(filters);
    return await this.routesRepository.findAll(persistenceFilters, page, limit);
  }

  async findOne(id: string): Promise<Route> {
    return await this.getRouteById(id);
  }
  async create(createRouteDTO: CreateRouteDTO): Promise<Route> {
    await this.ensureRouteDoesNotExist(createRouteDTO);

    this.logger.log(`Criando rota: ${createRouteDTO.nome}`);

    const route = new Route(
      createRouteDTO.nome,
      createRouteDTO.idCidadeOrigem,
      createRouteDTO.idCidadeDestino,
      createRouteDTO.distancia,
      createRouteDTO.tempoEstimado,
      createRouteDTO.localOrigem,
      createRouteDTO.viaPrincipal,
    );

    const result = await this.saveRoute(route);

    this.logger.log(`Rota criada: ${JSON.stringify(result)}`);
    return result;
  }

  async update(id: string, route: UpdateRouteDTO): Promise<Route> {
    this.validateUpdatePayload(route);

    const existingRoute = await this.getRouteById(id);

    this.logger.log(`Dados para atualização da rota: ${JSON.stringify(route)}`);

    const result = await this.saveUpdatedRoute(existingRoute.id, route);

    this.logger.log(`Rota atualizadoa: ${JSON.stringify(result)}`);
    return result;
  }
  async remove(id: string) {
    const route = await this.getRouteById(id);

    await this.routesRepository.delete(route.id);

    this.logger.log(`Rota com o ID:${id} excluída com sucesso`);

    return;
  }

  private async saveRoute(route: Route): Promise<Route> {
    return await this.routesRepository.create(RouteMapper.toPersistence(route));
  }

  private async saveUpdatedRoute(
    id: string,
    route: UpdateRouteDTO,
  ): Promise<Route> {
    return await this.routesRepository.update(
      id,
      RouteMapper.toPersistence(route),
    );
  }

  private async ensureRouteDoesNotExist(
    createRouteDTO: CreateRouteDTO,
  ): Promise<void> {
    const [routeNameExists, routeExistsByCities] = await Promise.all([
      this.routesRepository.findRouteByName(createRouteDTO.nome),
      this.routesRepository.findRouteByCities(
        createRouteDTO.idCidadeOrigem,
        createRouteDTO.idCidadeDestino,
      ),
    ]);

    if (routeNameExists || routeExistsByCities) {
      this.logger.warn(
        `Falha na criação da rota: Já existe uma rota com o nome ${createRouteDTO.nome} ou com os Ids das cidades de origem:${createRouteDTO.idCidadeOrigem} e destino ${createRouteDTO.idCidadeDestino}, informados`,
      );
      throw new BadRequestException(
        'Já existe uma rota com o nome informado ou com as cidades de origem e destino informadas',
      );
    }
  }

  private validateUpdatePayload(updateRouteDTO: UpdateRouteDTO): void {
    if (Object.keys(updateRouteDTO).length === 0) {
      this.logger.warn('Nenhum dado para atualização foi informado');
      throw new BadRequestException(
        'Nenhum dado para atualização foi informado',
      );
    }
  }

  private async getRouteById(id: string): Promise<Route> {
    const route = await this.routesRepository.findById(id);
    if (!route) {
      this.logger.warn(`Rota com o ID:${id} não encontrada`);
      throw new NotFoundException(`Rota com o ID:${id} não encontrada`);
    }

    return route;
  }
}
