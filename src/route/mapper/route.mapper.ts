import { Route } from '../entities/route.entity';
import { Routes as RoutesRecord } from '../../common/database/types';

export class RouteMapper {
  static toDomain(routeRecord: RoutesRecord): Route {
    return new Route(
      routeRecord.nome,
      routeRecord.id_cidade_origem,
      routeRecord.id_cidade_destino,
      routeRecord.distancia,
      routeRecord.tempo_estimado,
      routeRecord.local,
      routeRecord.via_principal,
      routeRecord.id,
      routeRecord.created_at,
      routeRecord.updated_at,
    );
  }

  static toPersistence(route: Partial<Route>): RoutesRecord {
    return {
      id: route.id,
      nome: route.nome,
      id_cidade_origem: route.idCidadeOrigem,
      id_cidade_destino: route.idCidadeDestino,
      distancia: route.distancia,
      tempo_estimado: route.tempoEstimado,
      local: route.local,
      via_principal: route.viaPrincipal,
      created_at: route.createdAt ? new Date(route.createdAt) : null,
      updated_at: route.updatedAt ? new Date(route.updatedAt) : null,
    };
  }
}
