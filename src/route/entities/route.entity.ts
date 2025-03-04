import { randomUUID } from 'crypto';

export class Route {
  public readonly id: string;
  public readonly originCity: string;
  public readonly destinationCity: string;
  public readonly originLocation: string;
  public readonly dayOfWeek: string;
  public readonly departureTime: string;
  public readonly arrivalTime: string;
  public readonly price: number;
  public readonly vehicleId: string;
  public readonly companyId: string;
  public readonly cityId: string;
  public readonly createdAt: Date | string | null;
  public readonly updatedAt: Date | string | null;

  constructor(
    originCity: string,
    destinationCity: string,
    originLocation: string,
    dayOfWeek: string,
    departureTime: string,
    arrivalTime: string,
    price: number,
    vehicleId: string,
    companyId: string,
    cityId: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || randomUUID();
    this.originCity = originCity;
    this.destinationCity = destinationCity;
    this.originLocation = originLocation;
    this.dayOfWeek = dayOfWeek;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.price = price;
    this.vehicleId = vehicleId;
    this.companyId = companyId;
    this.cityId = cityId;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }
}
