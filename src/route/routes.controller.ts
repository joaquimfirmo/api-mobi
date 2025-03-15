import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { StringValidationPipe } from '../common/pipes/string-validation.pipe';
import { Route } from './entities/route.entity';
import { RoutesService } from './routes.service';
import { CreateRouteDTO } from './dto/create-route.dto';
import { UpdateRouteDTO } from './dto/update-route.dto';

@Controller('rotas')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get('rota/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ): Promise<Route> {
    return await this.routesService.findOne(id);
  }

  @Get('rota/:nome/transportes')
  async findTransportsByRouteName(
    @Param('nome', StringValidationPipe) routeName: string,
  ) {
    return await this.routesService.findAllTransportOptionsByRoute(routeName);
  }

  @Post('rota')
  create(@Body() createRouteDTO: CreateRouteDTO) {
    return this.routesService.create(createRouteDTO);
  }

  @Patch('rota/:id')
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
    return this.routesService.update(id, payload);
  }

  @Delete('rota/:id')
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.routesService.remove(id);
  }
}
