import { Transports } from '../entities/transports.entity';
import { CompanyRouteSchedule } from '../entities/company-route-schedule.entity';
import {
  TransportsRecord,
  Transports as CompanyRouteScheduleRecord,
} from '../../common/database/types';
import { convertMoney } from '../../common/utils/money.utils';

export class TransportsMapper {
  static toDomain(transportRecord: TransportsRecord): Transports {
    return new Transports(
      transportRecord.rota,
      transportRecord.empresa,
      convertMoney(transportRecord.preco, 'reais'),
      transportRecord.distancia_km,
      transportRecord.duracao,
      transportRecord.via_principal,
      transportRecord.dia_semana,
      transportRecord.horario_partida,
      transportRecord.horario_chegada,
      transportRecord.veiculo,
    );
  }

  static toPersistence(
    transport: Partial<CompanyRouteSchedule>,
  ): CompanyRouteScheduleRecord {
    return {
      id: transport.id,
      id_empresa: transport.companyId,
      id_rota: transport.routeId,
      id_horario: transport.scheduleId,
      id_veiculo: transport.vehicleId,
      preco_passagem: convertMoney(transport.ticketPrice, 'centavos'),
      created_at: transport.createdAt ? new Date(transport.createdAt) : null,
      updated_at: transport.updatedAt ? new Date(transport.updatedAt) : null,
    };
  }
}
