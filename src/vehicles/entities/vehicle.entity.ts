import { randomUUID } from 'crypto';

export class Vehicle {
  public readonly id: string;
  public readonly nome: string;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    nome: string,
    id?: string,
    created_at?: Date | string | null,
    updated_at?: Date | string | null,
  ) {
    this.id = id || randomUUID();
    this.nome = nome;
    this.createdAt = created_at || null;
    this.updatedAt = updated_at || null;
  }
}
