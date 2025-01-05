import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transport } from './entities/transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { TransportsRepository } from './transports.repository';

@Injectable()
export class TransportsService {
  constructor(
    private readonly logger: Logger,
    private readonly transportsRepository: TransportsRepository,
  ) {}
  async create(createTransportDto: CreateTransportDto): Promise<Transport> {
    this.logger.log(
      `Criando transporte: ${JSON.stringify(createTransportDto)}`,
    );

    const transport = new Transport(
      createTransportDto.cidadeOrigem,
      createTransportDto.cidadeDestino,
      createTransportDto.localOrigem,
      createTransportDto.diaSemana,
      createTransportDto.horarioSaida,
      createTransportDto.horarioChegada,
      createTransportDto.preco,
      createTransportDto.idVeiculo,
      createTransportDto.idEmpresa,
      createTransportDto.idCidade,
    );
    const result = await this.transportsRepository.create(transport);
    this.logger.log(`Transporte criado: ${JSON.stringify(result)}`);

    return new Transport(
      result[0].cidade_origem,
      result[0].cidade_destino,
      result[0].local_origem,
      result[0].dia_semana,
      result[0].horario_saida,
      result[0].horario_chegada,
      result[0].preco,
      result[0].id_veiculo,
      result[0].id_empresa,
      result[0].id_cidade,
      result[0].id,
      result[0].created_at,
      result[0].updated_at,
    );
  }

  findAll(): Promise<any> {
    return this.transportsRepository.findAll();
  }

  async findOne(id: string): Promise<Transport> {
    this.logger.log(`Buscando transporte com o ID:${id}`);
    const result = await this.transportsRepository.findById(id);
    if (result.length === 0) {
      throw new NotFoundException(
        `Transporte com o ID:${id} informado não foi encontrado`,
      );
    }
    return new Transport(
      result[0].cidade_origem,
      result[0].cidade_destino,
      result[0].local_origem,
      result[0].dia_semana,
      result[0].horario_saida,
      result[0].horario_chegada,
      result[0].preco,
      result[0].id_veiculo,
      result[0].id_empresa,
      result[0].id_cidade,
      result[0].id,
      result[0].created_at,
      result[0].updated_at,
    );
  }

  async update(
    id: string,
    updateTransportDto: UpdateTransportDto,
  ): Promise<Transport> {
    const transportForUpdateExisting =
      await this.transportsRepository.findById(id);

    this.logger.log(
      `Transporte para atualização: ${JSON.stringify(transportForUpdateExisting)}`,
    );

    if (transportForUpdateExisting.length === 0) {
      throw new NotFoundException(
        `Transporte com o ID:${id} informado não foi encontrado`,
      );
    }

    const transport = new Transport(
      updateTransportDto.cidadeOrigem,
      updateTransportDto.cidadeDestino,
      updateTransportDto.localOrigem,
      updateTransportDto.diaSemana,
      updateTransportDto.horarioSaida,
      updateTransportDto.horarioChegada,
      updateTransportDto.preco,
      updateTransportDto.idVeiculo,
      updateTransportDto.idEmpresa,
      updateTransportDto.idCidade,
    );

    const result = await this.transportsRepository.update(id, transport);

    this.logger.log(`Transporte atualizado: ${JSON.stringify(result)}`);

    return new Transport(
      result[0].cidade_origem,
      result[0].cidade_destino,
      result[0].local_origem,
      result[0].dia_semana,
      result[0].horario_saida,
      result[0].horario_chegada,
      result[0].preco,
      result[0].id_veiculo,
      result[0].id_empresa,
      result[0].id_cidade,
      result[0].id,
      result[0].created_at,
      result[0].updated_at,
    );
  }

  async remove(id: string) {
    this.logger.log(`Excluindo transporte com o ID:${id}`);
    const transportExists = await this.transportsRepository.findById(id);

    if (transportExists.length === 0) {
      throw new NotFoundException(
        `Transporte para exclusão com o ID:${id} informado não foi encontrado`,
      );
    }

    return this.transportsRepository.delete(id);
  }
}
