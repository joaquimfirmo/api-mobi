import { randomUUID } from 'crypto';

export class CompanyRouteSchedule {
  id: string;
  companyId: string;
  routeId: string;
  scheduleId: string;
  vehicleId: string;
  ticketPrice: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    companyId: string,
    routeId: string,
    scheduleId: string,
    vehicleId: string,
    ticketPrice: number,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || randomUUID();
    this.companyId = companyId;
    this.routeId = routeId;
    this.scheduleId = scheduleId;
    this.vehicleId = vehicleId;
    this.ticketPrice = ticketPrice;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
