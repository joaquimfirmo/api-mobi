import { randomUUID } from 'crypto';

export class Schedule {
  public readonly id: string;
  public readonly horaPartida: string;
  public readonly horaChegada: string;
  public readonly idRota: string;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    horaPartida: string,
    horaChegada: string,
    idRota: string,
    id?: string,
    createdAt?: Date | string | null,
    updatedAt?: Date | string | null,
  ) {
    this.id = id || randomUUID();
    this.horaPartida = horaPartida;
    this.horaChegada = horaChegada;
    this.idRota = idRota;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || null;
  }
}
