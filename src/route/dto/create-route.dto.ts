import {
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsEnum,
  Matches,
} from 'class-validator';

export class CreateRouteDTO {
  @IsString()
  @MinLength(2, {
    message: 'Cidade de origem deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Cidade de origem deve ter no máximo 100 caracteres',
  })
  public readonly originCity: string;

  @IsString()
  @MinLength(2, {
    message: 'Cidade de destino deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Cidade de destino deve ter no máximo 100 caracteres',
  })
  public readonly destinationCity: string;

  @IsEnum(
    [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ],
    {
      message: 'Dia da semana inválido',
    },
  )
  public readonly dayOfWeek: string;

  @IsString()
  @MinLength(5, {
    message: 'Local de origem deve ter no mínimo 5 caracteres',
  })
  @MaxLength(100, {
    message: 'Local de origem deve ter no máximo 100 caracteres',
  })
  public readonly originLocation: string;

  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly departureTime: string;

  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly arrivalTime: string;

  @IsString()
  @Matches(/^\$\d+(?:\.\d{0,2})$/)
  public readonly price: number;

  @IsUUID(4)
  public readonly vehicleId: string;

  @IsUUID(4)
  public readonly companyId: string;

  @IsUUID(4)
  public readonly cityId: string;
}
