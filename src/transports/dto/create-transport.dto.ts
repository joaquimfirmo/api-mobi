import {
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsEnum,
  Matches,
} from 'class-validator';

export class CreateTransportDto {
  @IsString()
  @MinLength(2, {
    message: 'Cidade de origem deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Cidade de origem deve ter no máximo 100 caracteres',
  })
  public readonly cidadeOrigem: string;

  @IsString()
  @MinLength(2, {
    message: 'Cidade de destino deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Cidade de destino deve ter no máximo 100 caracteres',
  })
  public readonly cidadeDestino: string;

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
  public readonly diaSemana: string;

  @IsString()
  @MinLength(5, {
    message: 'Local de origem deve ter no mínimo 5 caracteres',
  })
  @MaxLength(100, {
    message: 'Local de origem deve ter no máximo 100 caracteres',
  })
  public readonly localOrigem: string;

  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly horarioSaida: string;

  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly horarioChegada: string;

  @IsString()
  @Matches(/^\$\d+(?:\.\d{0,2})$/)
  public readonly preco: number;

  @IsUUID(4)
  public readonly idVeiculo: string;

  @IsUUID(4)
  public readonly idEmpresa: string;

  @IsUUID(4)
  public readonly idCidade: string;
}
