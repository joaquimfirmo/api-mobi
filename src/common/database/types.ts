import { ColumnType } from 'kysely';

export interface Database {
  empresas: EmpresaTable;
  cidades: CidadeTable;
  veiculos: VeiculoTable;
  transportes: TransporteTable;
}

export interface EmpresaTable {
  id: ColumnType<string, string>;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  id_cidade: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
}

export interface CidadeTable {
  id: ColumnType<string, string>;
  nome: string;
  uf: string;
  cod_ibge: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface VeiculoTable {
  id: ColumnType<string, string>;
  nome: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, null>;
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
