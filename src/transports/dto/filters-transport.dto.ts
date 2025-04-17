import { IsOptional, IsUUID, IsNumber, IsEnum, Matches } from 'class-validator';
import { DiasSemana } from '../../types/enums/dias-semana.enum';

export class FiltersTransportDto {
  @IsOptional()
  @IsEnum(DiasSemana, {
    message:
      'O dia da semana deve ser um dos seguintes: Domingo, Segunda-feira, Terça-feira, Quarta-feira, Quinta-feira, Sexta-feira ou Sábado.',
  })
  public readonly diaSemana: DiasSemana;

  @IsOptional()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/, {
    message: 'A hora de partida deve estar no formato HH:mm:ss.',
  })
  public readonly horaPartida: string;

  @IsOptional()
  @IsUUID(4)
  public readonly idCidadeOrigem: string;

  @IsOptional()
  @IsUUID(4)
  public readonly idCidadeDestino: string;

  @IsOptional()
  @IsNumber()
  public readonly page: number;

  @IsOptional()
  @IsNumber()
  public readonly limit: number;
}
