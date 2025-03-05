import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Route } from './entities/route.entity';
import { CreateRouteDTO } from './dto/create-route.dto';
import { UpdateRouteDTO } from './dto/update-route.dto';
import { RoutesRepository } from './routes.repository';

@Injectable()
export class RoutesService {
  constructor(
    private readonly logger: Logger,
    private readonly routesRepository: RoutesRepository,
  ) {}

  async findAll(): Promise<Route[]> {
    const routes = await this.routesRepository.findAll();
    if (routes.length === 0) {
      throw new NotFoundException('Nenhum transporte foi encontrado');
    }

    return routes.map(
      (route) =>
        new Route(
          route.nome,
          route.id_cidade_origem,
          route.id_cidade_destino,
          route.distancia,
          route.tempo_estimado,
          route.local,
          route.id,
          route.created_at,
          route.updated_at,
        ),
    );
  }

  async findOne(id: string): Promise<Route> {
    const result = await this.routesRepository.findById(id);
    if (result.length === 0) {
      throw new NotFoundException(
        `Transporte com o ID:${id} informado não foi encontrado`,
      );
    }
    const [route] = result;

    return new Route(
      route.nome,
      route.id_cidade_origem,
      route.id_cidade_destino,
      route.distancia,
      route.tempo_estimado,
      route.local,
      route.id,
      route.created_at,
      route.updated_at,
    );
  }

  async create(createRouteDTO: CreateRouteDTO): Promise<Route> {
    const [routeNameExists, routeExistsByCities] = await Promise.all([
      this.routesRepository.findRouteByName(createRouteDTO.nome),
      this.routesRepository.findRouteByCities(
        createRouteDTO.idCidadeOrigem,
        createRouteDTO.idCidadeDestino,
      ),
    ]);

    if (routeNameExists.length > 0 || routeExistsByCities.length > 0) {
      this.logger.warn(
        `Falha na criação da rota: Já existe uma rota com o nome ${createRouteDTO.nome} ou com os Ids das cidades de origem:${createRouteDTO.idCidadeOrigem} e destino ${createRouteDTO.idCidadeDestino}, informados`,
      );
      throw new BadRequestException(
        'Já existe uma rota com o nome informado ou com as cidades de origem e destino informadas',
      );
    }

    this.logger.log(`Criando rota: ${JSON.stringify(CreateRouteDTO)}`);

    const route = new Route(
      createRouteDTO.nome,
      createRouteDTO.idCidadeOrigem,
      createRouteDTO.idCidadeDestino,
      createRouteDTO.distancia,
      createRouteDTO.tempoEstimado,
      createRouteDTO.localOrigem,
    );
    const result = await this.routesRepository.create(route);

    const [createdRoute] = result;
    this.logger.log(`Rota criada: ${JSON.stringify(createdRoute)}`);

    return new Route(
      createdRoute.nome,
      createdRoute.id_cidade_origem,
      createdRoute.id_cidade_destino,
      createdRoute.distancia,
      createdRoute.tempo_estimado,
      createdRoute.local,
      createdRoute.id,
      createdRoute.created_at,
      createdRoute.updated_at,
    );
  }

  async update(id: string, route: UpdateRouteDTO): Promise<Route> {
    if (Object.keys(route).length === 0) {
      this.logger.warn('Dados para atualização da rota não informados');
      throw new BadRequestException(
        'Dados para atualização da rota não informados',
      );
    }

    const routeForUpdateExisting = await this.routesRepository.findById(id);

    if (routeForUpdateExisting.length === 0) {
      this.logger.warn(
        `Falha na atualização da rota: Rota com o ID:${id} informado não foi encontrada`,
      );
      throw new BadRequestException(
        `Rota com o ID:${id} informado não foi encontrada`,
      );
    }

    this.logger.log(`Dados para atualização da rota: ${JSON.stringify(route)}`);

    const result = await this.routesRepository.update(id, route);

    const [updatedRoute] = result;

    this.logger.log(`Rota atualizadoa: ${JSON.stringify(updatedRoute)}`);

    return new Route(
      updatedRoute.nome,
      updatedRoute.id_cidade_origem,
      updatedRoute.id_cidade_destino,
      updatedRoute.distancia,
      updatedRoute.tempo_estimado,
      updatedRoute.local,
      updatedRoute.id,
      updatedRoute.created_at,
      updatedRoute.updated_at,
    );
  }

  async remove(id: string) {
    const routeExists = await this.routesRepository.findById(id);

    if (routeExists.length === 0) {
      this.logger.warn(
        `Falha na exclusão da rota: Rota com o ID:${id} não foi encontrada`,
      );
      throw new NotFoundException(
        `Rota para exclusão com o ID:${id} não foi encontrada`,
      );
    }

    await this.routesRepository.delete(id);
    this.logger.log(`Rota com o ID:${id} excluída com sucesso`);
    return;
  }
}
