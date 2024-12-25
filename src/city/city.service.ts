import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { IbgeClient } from '../gateway/ibge/ibge.client';
import { CityRepository } from './city.repository';
import City from './entities/city';

@Injectable()
export class CityService {
  constructor(
    private readonly logger: Logger,
    private readonly cityRepository: CityRepository,
    private readonly ibgeClient: IbgeClient,
  ) {}

  async findAllCities(): Promise<any> {
    this.logger.log('Buscando todas as cidades');
    return this.cityRepository.findAll();
  }

  async getCityById(id: string): Promise<any> {
    this.logger.log(`Buscando cidade com o ID:${id}`);
    return this.cityRepository.findById(id);
  }

  async isValidCity(name: string, code: number): Promise<boolean> {
    const city = await this.ibgeClient.isValidCity(name, code);
    if (city.isValid) {
      return true;
    }
    return false;
  }
  async findOrCreateCity(name: string, uf: string, code: number): Promise<any> {
    this.logger.log(`Buscando cidade com nome ${name} e código ${code}`);
    const city = await this.cityRepository.findByNameAndCode(name, code);
    if (city.length > 0) {
      this.logger.log(`Cidade encontrada: ${JSON.stringify(city[0])}`);
      return city[0];
    }

    const cityIsValid = await this.isValidCity(name, code);
    if (!cityIsValid) {
      throw new BadRequestException('Cidade inválida');
    }
    const cityData = City.create({ nome: name, uf, cod_ibge: code });
    return await this.cityRepository.create(cityData);
  }
}
