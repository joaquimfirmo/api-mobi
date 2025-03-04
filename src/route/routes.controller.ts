import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { Route } from './entities/route.entity';
import { RoutesService } from './routes.service';
import { CreateRouteDTO } from './dto/create-route.dto';
import { UpdateRouteDTO } from './dto/update-route.dto';

@Controller('transportes')
export class RoutesController {
  constructor(private readonly transportsService: RoutesService) {}

  @Get()
  findAll() {
    return this.transportsService.findAll();
  }

  @Get('transporte/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ): Promise<Route> {
    return await this.transportsService.findOne(id);
  }

  @Get('cidade/:id')
  async findByCityId(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,

    @Query() query,
  ): Promise<any> {
    const { page, limit, day, hour, city_destination } = query;

    return await this.transportsService.findTransportsByCity(id, {
      page,
      limit,
      day,
      hour,
      city_destination,
    });
  }

  @Post('transporte')
  create(@Body() createTransportDto: CreateRouteDTO) {
    return this.transportsService.create(createTransportDto);
  }

  @Patch('transporte/:id')
  update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
    @Body() payload: UpdateRouteDTO,
  ) {
    return this.transportsService.update(id, payload);
  }

  @Delete('transporte/:id')
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.transportsService.remove(id);
  }
}
