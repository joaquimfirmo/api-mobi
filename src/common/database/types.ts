import { ColumnType } from 'kysely';

export interface Database {
  empresas: EmpresaTable;
  cidades: CidadeTable;
  horarios: HorariosTable;
  rotas: RotasTable;
  empresas_rotas: EmpresasRotasTable;
  veiculos: VeiculoTable;
  transportes: TransporteTable;
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
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export interface CidadeTable {
  id: ColumnType<string, string>;
  nome: string;
  uf: string;
  codigo_ibge: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface HorariosTable {
  id: ColumnType<string, string>;
  hora_partida: ColumnType<Date, string>;
  hora_chegada: ColumnType<Date, string>;
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
  tempo_estimado: number;
  created_at?: ColumnType<Date, string | undefined, never>;
  updated_at?: ColumnType<Date, string | undefined, null>;
  local: string;
}

export interface TransporteTable {
  id: ColumnType<string, string>;
  cidade_origem: string;
  cidade_destino: string;
  local_origem: string;
  dia_semana: string;
  horario_saida: string;
  horario_chegada: string;
  preco: number;
  id_veiculo: string;
  id_empresa: string;
  id_cidade: string;
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
