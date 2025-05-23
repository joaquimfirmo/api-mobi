import { randomUUID } from 'crypto';

export default class Company {
  public readonly id: string;
  public readonly razaoSocial: string;
  public readonly nomeFantasia: string;
  public readonly cnpj: string;
  public readonly email: string;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    razaoSocial: string,
    nomeFantasia: string,
    cnpj: string,
    email: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || randomUUID();
    this.razaoSocial = razaoSocial;
    this.nomeFantasia = nomeFantasia;
    this.cnpj = cnpj;
    this.email = email;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }
}
