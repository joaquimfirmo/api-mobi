import {
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateRouteDTO {
  @IsString()
  @MinLength(2, {
    message: 'Nome da rota deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Nome da rota deve ter no máximo 100 caracteres',
  })
  public readonly nome: string;

  @IsUUID(4)
  public readonly idCidadeOrigem: string;

  @IsUUID(4)
  public readonly idCidadeDestino: string;

  @IsNumber()
  public readonly distancia: number;

  @IsString()
  @MinLength(5, {
    message: 'Tempo estimado deve ter no mínimo 5 caracteres',
  })
  @MaxLength(100, {
    message: 'Tempo estimado deve ter no máximo 100 caracteres',
  })
  public readonly tempoEstimado: string;
  @IsString()
  @MinLength(5, {
    message: 'Local de origem deve ter no mínimo 5 caracteres',
  })
  @MaxLength(200, {
    message: 'Local de origem deve ter no máximo 255 caracteres',
  })
  public readonly localOrigem: string;

  @IsOptional()
  @IsString()
  @MinLength(5, {
    message: 'Via principal deve ter no mínimo 5 caracteres',
  })
  @MaxLength(255, {
    message: 'Via principal deve ter no máximo 255 caracteres',
  })
  public readonly viaPrincipal: string;
}
