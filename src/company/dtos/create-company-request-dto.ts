import {
  IsString,
  MinLength,
  MaxLength,
  Length,
  IsInt,
  IsNumberString,
  IsNotEmpty,
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
  razao_social: string;

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
  nome_fantasia: string;

  @IsNotEmpty({
    message: 'CNPJ é obrigatório',
  })
  @Length(14, 14, {
    message: 'CNPJ deve ter 14 caracteres',
  })
  @IsNumberString()
  cnpj: string;

  @IsNotEmpty({
    message: 'Cidade é obrigatória',
  })
  @IsString({
    message: 'Nome da cidade deve ser uma string',
  })
  @MinLength(2, {
    message: 'Nome da cidade deve ter no mínimo 2 caracteres',
  })
  cidade: string;

  @IsNotEmpty({
    message: 'UF é obrigatório',
  })
  @IsString({
    message: 'UF deve ser uma string',
  })
  @MinLength(2, {
    message: 'UF deve ter no mínimo 2 caracteres',
  })
  @MaxLength(2, {
    message: 'UF deve ter no máximo 2 caracteres',
  })
  uf: string;

  @IsNotEmpty({
    message: 'Código da cidade é obrigatório',
  })
  @IsInt({
    message: 'Código da cidade deve ser um número inteiro',
  })
  codigo_cidade: number;
}
