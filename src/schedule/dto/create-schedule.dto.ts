import { IsString, Matches, IsUUID, IsEnum } from 'class-validator';
import { DiasSemana } from '../../types/enums/dias-semana.enum';

export class CreateScheduleDto {
  @IsEnum(DiasSemana, {
    message:
      'O dia da semana deve ser um dos seguintes: Domingo, Segunda-feira, Terça-feira, Quarta-feira, Quinta-feira, Sexta-feira ou Sábado.',
  })
  public readonly diaSemana: DiasSemana;
  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly horaPartida: string;

  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly horaChegada: string;

  @IsUUID(4)
  public readonly idRota: string;
}
