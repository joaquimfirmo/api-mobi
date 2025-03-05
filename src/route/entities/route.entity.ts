import { randomUUID } from 'crypto';

export class Route {
  public readonly id: string;
  public readonly name: string;
  public readonly idOriginCity: string;
  public readonly idDestinationCity: string;
  public readonly distance: number;
  public readonly estimatedTime: string;
  public readonly originLocation: string;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    name: string,
    idOriginCity: string,
    idDestinationCity: string,
    distance: number,
    estimatedTime: string,
    originLocation: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || randomUUID();
    this.name = name;
    this.idOriginCity = idOriginCity;
    this.idDestinationCity = idDestinationCity;
    this.distance = distance;
    this.estimatedTime = estimatedTime;
    this.originLocation = originLocation;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }
}
