import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { CityService } from './city.service';

@Controller('cidades')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async findAll() {
    return await this.cityService.findAllCities();
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ) {
    return await this.cityService.getCityById(id);
  }
}
