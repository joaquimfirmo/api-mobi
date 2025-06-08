import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { FiltersTransportDto } from './dto/filters-transport.dto';
import { CreateTransportDto } from './dto/create-transport.dto';

@Controller('transportes')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) {}

  @Get()
  findAll(
    @Query()
    queryParams: FiltersTransportDto,
  ) {
    const { page = 0, limit = 25, ...filters } = queryParams;
    return this.transportsService.findAll(filters, page, limit);
  }

  @Post()
  create(@Body() transport: CreateTransportDto) {
    return this.transportsService.create(transport);
  }
}
