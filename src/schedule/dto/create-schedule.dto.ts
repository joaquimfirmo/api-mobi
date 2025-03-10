import { IsString, Matches, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly horaPartida: string;

  @IsString()
  @Matches(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
  public readonly horaChegada: string;

  @IsUUID(4)
  public readonly idRota: string;
}
