import { randomUUID } from 'crypto';

export default class Company {
  public readonly id: string;
  public readonly razaoSocial: string;
  public readonly nomeFantasia: string;
  public readonly cnpj: string;
  public readonly idCidade: string;

  constructor(
    razao_social: string,
    nome_fantasia: string,
    cnpj: string,
    id_cidade: string,
    id?: string,
  ) {
    this.id = id || randomUUID();
    this.razaoSocial = razao_social;
    this.nomeFantasia = nome_fantasia;
    this.cnpj = cnpj;
    this.idCidade = id_cidade;
  }
}
