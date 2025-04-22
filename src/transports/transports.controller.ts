import { Controller, Get, Query } from '@nestjs/common';
import { TransportsService } from './transports.service';

@Controller('transportes')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) {}

  @Get()
  findAll(
    @Query()
    queryParams: any,
  ) {
    const { page = 0, limit = 25, ...filters } = queryParams;
    return this.transportsService.findAll(filters, page, limit);
  }
}
