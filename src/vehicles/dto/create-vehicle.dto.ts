import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty({
    message: 'Nome do veículo é obrigatório',
  })
  @IsString({
    message: 'Nome do veículo deve ser uma string',
  })
  @MinLength(3, {
    message: 'Nome do veículo deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Nome do veículo deve ter no máximo 100 caracteres',
  })
  nome: string;
}
