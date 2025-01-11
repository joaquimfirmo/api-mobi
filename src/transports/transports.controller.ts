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
import { Transport } from './entities/transport.entity';
import { TransportsService } from './transports.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';

@Controller('transportes')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) {}

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
  ): Promise<Transport> {
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
  ): Promise<any> {
    return await this.transportsService.findTransportsByCity(id);
  }

  @Post('transporte')
  create(@Body() createTransportDto: CreateTransportDto) {
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
    @Body() payload: UpdateTransportDto,
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
