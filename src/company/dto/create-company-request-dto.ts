import {
  IsString,
  MinLength,
  MaxLength,
  Length,
  IsNumberString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export default class CreateCompanyRequestDTO {
  @IsNotEmpty({
    message: 'Razão social é obrigatória',
  })
  @IsString({
    message: 'Nome da empresa deve ser uma string',
  })
  @MinLength(2, {
    message: 'Nome da empresa deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Nome da empresa deve ter no máximo 100 caracteres',
  })
  razaoSocial: string;

  @IsNotEmpty({
    message: 'Nome fantasia é obrigatório',
  })
  @IsString({
    message: 'Nome fantasia deve ser uma string',
  })
  @MinLength(2, {
    message: 'Nome fantasia deve ter no mínimo 2 caracteres',
  })
  @MaxLength(100, {
    message: 'Nome fantasia deve ter no máximo 100 caracteres',
  })
  nomeFantasia: string;

  @IsNotEmpty({
    message: 'CNPJ é obrigatório',
  })
  @Length(14, 14, {
    message: 'CNPJ deve ter 14 caracteres',
  })
  @IsNumberString()
  cnpj: string;

  @IsNotEmpty({
    message: 'Email é obrigatório',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}
