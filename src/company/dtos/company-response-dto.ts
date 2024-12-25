export default class CompanyResponseDTO {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  id_cidade: string;
  created_at: Date | string;
  updated_at: Date | string | null;
}
