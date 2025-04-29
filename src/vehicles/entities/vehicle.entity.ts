import { randomUUID } from 'crypto';

export class Vehicle {
  public readonly id: string;
  public readonly nome: string;
  public readonly created_at: Date | string | null;
  public readonly updated_at: Date | string | null;

  constructor(
    nome: string,
    id?: string,
    created_at?: Date | string | null,
    updated_at?: Date | string | null,
  ) {
    this.id = id || randomUUID();
    this.nome = nome;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
  }
}
