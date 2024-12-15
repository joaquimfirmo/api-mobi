import { randomUUID } from 'crypto';

export default class City {
  public readonly id: string;
  public readonly nome: string;
  public readonly uf: string;
  public readonly cod_ibge: number;

  constructor(id: string, nome: string, uf: string, cod_ibge: number) {
    this.id = id;
    this.nome = nome;
    this.uf = uf;
    this.cod_ibge = cod_ibge;
  }

  public static create({ nome, uf, cod_ibge }): City {
    const id = randomUUID();
    return new City(id, nome, uf, cod_ibge);
  }
}
