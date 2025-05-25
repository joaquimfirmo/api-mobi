import { DiasSemana } from '../../types/enums/dias-semana.enum';

export type TransportFilters = {
  diaSemana?: DiasSemana;
  horaPartida?: string;
  idCidadeOrigem?: string;
  idCidadeDestino?: string;
};
