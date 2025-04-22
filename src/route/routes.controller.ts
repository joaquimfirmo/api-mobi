import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { Route } from './entities/route.entity';
import { RoutesService } from './routes.service';
import { CreateRouteDTO } from './dto/create-route.dto';
import { UpdateRouteDTO } from './dto/update-route.dto';

@Controller('rotas')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  findAll(
    @Query()
    queryParams: any,
  ) {
    const { page = 0, limit = 25, ...filters } = queryParams;
    return this.routesService.findAll(filters, page, limit);
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

  @Post('rota')
  create(@Body() createRouteDTO: CreateRouteDTO): Promise<Route> {
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
  ): Promise<Route> {
    return this.routesService.update(id, payload);
  }

  @Delete('rota/:id')
  @HttpCode(204)
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
