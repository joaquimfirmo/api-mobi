import { ColumnType, Selectable } from 'kysely';
import { DiasSemana } from '../../types/diasSemana.type';

export interface Database {
  empresas: EmpresaTable;
  cidades: CidadeTable;
  horarios: HorariosTable;
  rotas: RotasTable;
  empresas_rotas_horarios: EmpresasRotasHorariosTable;
  veiculos: VeiculoTable;
  usuarios: UsuarioTable;
}

export interface EmpresaTable {
  id: ColumnType<string, string>;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export interface EmpresasRotasHorariosTable {
  id: ColumnType<string, string>;
  id_empresa: ColumnType<string, string>;
  id_rota: ColumnType<string, string>;
  id_horario: ColumnType<string, string>;
  id_veiculo: ColumnType<string, string>;
  preco_passagem: number;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export interface CidadeTable {
  id: ColumnType<string, string>;
  nome: string;
  uf: string;
  codigo_ibge: number;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export interface HorariosTable {
  id: ColumnType<string, string>;
  dia_semana: DiasSemana;
  hora_partida: string;
  hora_chegada: string;
  id_rota: ColumnType<string, string>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export type Schedules = Selectable<HorariosTable>;
export type Companies = Selectable<EmpresaTable>;
export type Routes = Selectable<RotasTable>;
export type Vehicles = Selectable<VeiculoTable>;
export type Transports = Selectable<EmpresasRotasHorariosTable>;

export interface RotasTable {
  id: ColumnType<string, string>;
  nome: string;
  id_cidade_origem: ColumnType<string, string>;
  id_cidade_destino: ColumnType<string, string>;
  distancia: number;
  tempo_estimado: string;
  local: string;
  via_principal: string | null | undefined;
  created_at?: ColumnType<Date, string | undefined, never>;
  updated_at?: ColumnType<Date, string | undefined, null>;
}

export interface VeiculoTable {
  id: ColumnType<string, string>;
  nome: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export type Permissoes = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'GUEST';

export interface UsuarioTable {
  id: ColumnType<string, string>;
  nome: string;
  email: string;
  senha: string;
  permissoes: Permissoes;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export type TransportsRecord = {
  rota: string;
  empresa: string;
  preco: number;
  distancia_km: string;
  duracao: string;
  via_principal: string;
  veiculo: string;
  dia_semana: string;
  horario_partida: string;
  horario_chegada: string;
};
