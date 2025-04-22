import { randomUUID } from 'crypto';

export class City {
  public readonly id: string;
  public readonly nome: string;
  public readonly uf: string;
  public readonly codigoIbge: number;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    id: string,
    nome: string,
    uf: string,
    codigoIbge: number,
    createdAt?: Date | string | null,
    updatedAt?: Date | string | null,
  ) {
    this.id = id;
    this.nome = nome;
    this.uf = uf;
    this.codigoIbge = codigoIbge;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || null;
  }

  public static create({ nome, uf, codigoIbge }): City {
    const id = randomUUID();
    return new City(id, nome, uf, codigoIbge);
  }
}
