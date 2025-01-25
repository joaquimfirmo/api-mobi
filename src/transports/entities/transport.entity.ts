import { randomUUID } from 'crypto';

export class Transport {
  public readonly id: string;
  public readonly cidadeOrigem: string;
  public readonly cidadeDestino: string;
  public readonly localOrigem: string;
  public readonly diaSemana: string;
  public readonly horarioSaida: string;
  public readonly horarioChegada: string;
  public readonly preco: number;
  public readonly idVeiculo: string;
  public readonly idEmpresa: string;
  public readonly idCidade: string;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    cidadeOrigem: string,
    cidadeDestino: string,
    localOrigem: string,
    diaSemana: string,
    horarioSaida: string,
    horarioChegada: string,
    preco: number,
    idVeiculo: string,
    idEmpresa: string,
    idCidade: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || randomUUID();
    this.cidadeOrigem = cidadeOrigem;
    this.cidadeDestino = cidadeDestino;
    this.localOrigem = localOrigem;
    this.diaSemana = diaSemana;
    this.horarioSaida = horarioSaida;
    this.horarioChegada = horarioChegada;
    this.preco = preco;
    this.idVeiculo = idVeiculo;
    this.idEmpresa = idEmpresa;
    this.idCidade = idCidade;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }
}
