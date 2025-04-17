import { randomUUID } from 'crypto';
import { DiasSemana } from '../../types/diasSemana.type';

export class Schedule {
  public readonly id: string;
  public readonly diaSemana: DiasSemana;
  public readonly horaPartida: string;
  public readonly horaChegada: string;
  public readonly idRota: string;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    diaSemana: DiasSemana,
    horaPartida: string,
    horaChegada: string,
    idRota: string,
    id?: string,
    createdAt?: Date | string | null,
    updatedAt?: Date | string | null,
  ) {
    this.id = id || randomUUID();
    this.diaSemana = diaSemana;
    this.horaPartida = horaPartida;
    this.horaChegada = horaChegada;
    this.idRota = idRota;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || null;
  }
}
