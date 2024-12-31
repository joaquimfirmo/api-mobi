import { ColumnType } from 'kysely';

export interface Database {
  empresas: EmpresaTable;
  cidades: CidadeTable;
  veiculos: VeiculoTable;
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
