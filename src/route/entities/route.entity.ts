import { randomUUID } from 'crypto';

export class Route {
  public readonly id: string;
  public readonly nome: string;
  public readonly idCidadeOrigem: string;
  public readonly idCidadeDestino: string;
  public readonly distancia: number;
  public readonly tempoEstimado: string;
  public readonly local: string;
  public readonly viaPrincipal: string | null;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    nome: string,
    idCidadeOrigem: string,
    idCidadeDestino: string,
    distancia: number,
    tempoEstimado: string,
    local: string,
    viaPrincipal?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || randomUUID();
    this.nome = nome;
    this.idCidadeOrigem = idCidadeOrigem;
    this.idCidadeDestino = idCidadeDestino;
    this.distancia = distancia;
    this.tempoEstimado = tempoEstimado;
    this.local = local;
    this.viaPrincipal = viaPrincipal || null;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }
}
