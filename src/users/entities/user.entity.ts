import { randomUUID } from 'crypto';

type Permissoes = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'GUEST';
export default class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly permissions: Permissoes;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    name: string,
    email: string,
    password: string,
    permissions: Permissoes,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.permissions = permissions;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }
}
