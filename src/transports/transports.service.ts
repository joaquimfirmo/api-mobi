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

  async findAll(): Promise<Transport[]> {
    this.logger.log('Buscando todos os transportes');
    const transports = await this.transportsRepository.findAll();
    if (transports.length === 0) {
      throw new NotFoundException('Nenhum transporte foi encontrado');
    }

    return transports.map(
      (transport) =>
        new Transport(
          transport.cidade_origem,
          transport.cidade_destino,
          transport.dia_semana,
          transport.local_origem,
          transport.horario_saida,
          transport.horario_chegada,
          transport.preco,
          transport.id_empresa,
          transport.id_veiculo,
          transport.id_cidade,
          transport.id,
          transport.created_at,
          transport.updated_at,
        ),
    );
  }

  async findOne(id: string): Promise<Transport> {
    this.logger.log(`Buscando transporte com o ID:${id}`);
    const result = await this.transportsRepository.findById(id);
    if (result.length === 0) {
      throw new NotFoundException(
        `Transporte com o ID:${id} informado não foi encontrado`,
      );
    }
    const [transport] = result;

    return new Transport(
      transport.cidade_origem,
      transport.cidade_destino,
      transport.local_origem,
      transport.dia_semana,
      transport.horario_saida,
      transport.horario_chegada,
      transport.preco,
      transport.id_veiculo,
      transport.id_empresa,
      transport.id_cidade,
      transport.id,
      transport.created_at,
      transport.updated_at,
    );
  }

  async findTransportsByCity(cityId: string): Promise<any> {
    this.logger.log(`Buscando transportes da ccityIdade com o ID:${cityId}`);
    const transports = await this.transportsRepository.findByCityId(cityId);
    if (transports.length === 0) {
      throw new NotFoundException(
        `Transportes da cidade com o ID:${cityId} informado não foram encontrados`,
      );
    }
    return transports;
  }

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

    const [createdTransport] = result;
    this.logger.log(`Transporte criado: ${JSON.stringify(createdTransport)}`);

    return new Transport(
      createdTransport.cidade_origem,
      createdTransport.cidade_destino,
      createdTransport.local_origem,
      createdTransport.dia_semana,
      createdTransport.horario_saida,
      createdTransport.horario_chegada,
      createdTransport.preco,
      createdTransport.id_veiculo,
      createdTransport.id_empresa,
      createdTransport.id_cidade,
      createdTransport.id,
      createdTransport.created_at,
      createdTransport.updated_at,
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

    const [updatedTransport] = result;

    this.logger.log(
      `Transporte atualizado: ${JSON.stringify(updatedTransport)}`,
    );

    return new Transport(
      updatedTransport.cidade_origem,
      updatedTransport.cidade_destino,
      updatedTransport.local_origem,
      updatedTransport.dia_semana,
      updatedTransport.horario_saida,
      updatedTransport.horario_chegada,
      updatedTransport.preco,
      updatedTransport.id_veiculo,
      updatedTransport.id_empresa,
      updatedTransport.id_cidade,
      updatedTransport.id,
      updatedTransport.created_at,
      updatedTransport.updated_at,
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
