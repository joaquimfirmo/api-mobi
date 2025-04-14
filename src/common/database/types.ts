import { ColumnType } from 'kysely';

export interface Database {
  empresas: EmpresaTable;
  cidades: CidadeTable;
  horarios: HorariosTable;
  rotas: RotasTable;
  empresas_rotas: EmpresasRotasTable;
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

export interface EmpresasRotasTable {
  id_empresa: ColumnType<string, string>;
  id_rota: ColumnType<string, string>;
  id_horario: ColumnType<string, string>;
  id_veiculo: ColumnType<string, string>;
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

export type DiasSemana =
  | 'Domingo'
  | 'Segunda-feira'
  | 'Terça-feira'
  | 'Quarta-feira'
  | 'Quinta-feira'
  | 'Sexta-feira'
  | 'Sábado';

export interface HorariosTable {
  id: ColumnType<string, string>;
  dia_semana: DiasSemana;
  hora_partida: string;
  hora_chegada: string;
  id_rota: ColumnType<string, string>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export interface RotasTable {
  id: ColumnType<string, string>;
  nome: string;
  id_cidade_origem: ColumnType<string, string>;
  id_cidade_destino: ColumnType<string, string>;
  distancia: number;
  tempo_estimado: string;
  local: string;
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
