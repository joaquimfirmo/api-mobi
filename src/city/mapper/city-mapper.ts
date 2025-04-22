import { City } from '../entities/city';
import { CityDto } from '../dto/city-dto';

export class CityMapper {
  static toDomain(cityDto: CityDto): City {
    return new City(
      cityDto.id,
      cityDto.nome,
      cityDto.uf,
      cityDto.codigo_ibge,
      cityDto.created_at,
      cityDto.updated_at,
    );
  }

  static toPersistence(city: City): CityDto {
    return {
      id: city.id,
      nome: city.nome,
      uf: city.uf,
      codigo_ibge: city.codigoIbge,
      created_at: city.createdAt,
      updated_at: city.updatedAt,
    };
  }
}
