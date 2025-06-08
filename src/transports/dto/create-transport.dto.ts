import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTransportDto {
  @IsUUID(4, { message: 'O ID da empresa deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da empresa não pode estar vazio.' })
  public readonly empresaId: string;

  @IsUUID(4, { message: 'O ID da rota deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da rota não pode estar vazio.' })
  public readonly rotaId: string;

  @IsUUID(4, { message: 'O ID do horário deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID do horário não pode estar vazio.' })
  public readonly horarioId: string;

  @IsUUID(4, { message: 'O ID do veículo deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID do veículo não pode estar vazio.' })
  public readonly veiculoId: string;

  @IsNumber({}, { message: 'O preço da passagem deve ser um número.' })
  @IsNotEmpty({ message: 'O preço da passagem não pode estar vazio.' })
  public readonly precoPassagem: number;
}
