# 🚀 API Mobi

**Atenção**: Esta API ainda está em construção 🛠️ e algumas funcionalidades podem não estar 100% completas. Estamos trabalhando para entregar a melhor experiência possível! 🚧

A **API Mobi** é uma aplicação server-side desenvolvida com o framework [NestJS](https://nestjs.com/). Esta API gerencia informações sobre meios de transporte disponíveis entre cidades, incluindo **rotas**, **horários**, **preços**, **veículos** e **empresas de transporte** que operam em uma determinada região.

## 📋 Funcionalidades

A API Mobi oferece as seguintes funcionalidades:

- **Gerenciamento de Rotas**:

  - Cadastro, atualização, exclusão e listagem de rotas entre cidades.
  - Informações detalhadas sobre as rotas, como distância, tempo estimado e via principal.

- **Horários de Transporte**:

  - Consulta de horários disponíveis para rotas específicas.
  - Filtro por dia da semana e horário.

- **Empresas de Transporte**:

  - Cadastro e gerenciamento de empresas que operam nas rotas.
  - Associação de empresas a rotas e horários.

- **Veículos**:

  - Cadastro de tipos de veículos (ex.: ônibus, vans, carros).
  - Associação de veículos a horários e rotas.

- **Consulta de Opções de Transporte**:
  - Listagem de transportes disponíveis para uma rota específica em um horário específico.
  - Informações detalhadas sobre a empresa, veículo e horário.

## 🛠️ Tecnologias Utilizadas

A API Mobi foi construída utilizando as seguintes tecnologias:

- **[NestJS](https://nestjs.com/)**: Framework para construção de aplicações server-side escaláveis.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional utilizado para armazenar as informações.
- **[Kysely](https://kysely.dev/)**: Query builder para interagir com o banco de dados.
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem utilizada para garantir tipagem estática e maior segurança no desenvolvimento.
- **[Jest](https://jestjs.io/)**: Framework de testes para garantir a qualidade do código.
- **[ESLint](https://eslint.org/)** e **[Prettier](https://prettier.io/)**: Ferramentas para padronização e formatação do código.

## 📂 Estrutura do Projeto

A estrutura do projeto segue os padrões do NestJS:

```
.env
.eslintrc.js
.gitignore
.prettierrc
coverage/
nest-cli.json
package.json
README.md
src/
  app.controller.spec.ts
  app.controller.ts
  app.module.ts
  app.service.ts
  city/
  common/
  company/
  gateway/
  main.ts
  route/
  transports/
  users/
  vehicles/
test/
tsconfig.build.json
tsconfig.json
```

## ⚙️ Configuração do Banco de Dados

A conexão com o banco de dados é configurada no arquivo `database.providers.ts`. Certifique-se de definir as variáveis de ambiente no arquivo `.env`:

```
BD_USER=<seu_usuario>
BD_HOST=<seu_host>
BD_DATABASE=<seu_banco_de_dados>
BD_PASSWORD=<sua_senha>
BD_PORT=<sua_porta>
```

> **Nota**: Este projeto utiliza o banco de dados **PostgreSQL**.

## 🚀 Inicialização da Aplicação

O ponto de entrada da aplicação é o arquivo `main.ts`, que configura o NestJS e inicia o servidor na porta `8080`:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
```

### 🏗️ Instalação

Certifique-se de ter o [Node.js](https://nodejs.org/) versão 20 instalada.

```bash
# Instale as dependências
$ yarn install
```

### ▶️ Executando a Aplicação

```bash
# Desenvolvimento
$ yarn run start

# Modo watch
$ yarn run start:dev

# Produção
$ yarn run start:prod
```

### ✅ Testes

```bash
# Testes unitários
$ yarn run test

# Testes end-to-end
$ yarn run test:e2e

# Cobertura de testes
$ yarn run test:cov
```

## 📊 Endpoints Disponíveis

### **Rotas**

- **GET `/rotas`**: Lista todas as rotas com filtros opcionais.
- **GET `/rotas/rota/:id`**: Retorna detalhes de uma rota específica.
- **POST `/rotas/rota`**: Cria uma nova rota.
- **PATCH `/rotas/rota/:id`**: Atualiza uma rota existente.
- **DELETE `/rotas/rota/:id`**: Remove uma rota.

### **Empresas**

- **GET `/empresas`**: Lista todas as empresas.
- **POST `/empresas`**: Cadastra uma nova empresa.

### **Veículos**

- **GET `/veiculos`**: Lista todos os tipos de veículos.
- **POST `/veiculos`**: Cadastra um novo tipo de veículo.

### **Horários**

- **GET `/horarios`**: Lista horários disponíveis para rotas.
- **POST `/horarios`**: Cadastra um novo horário.

### **Consulta de Transportes**

- **GET `/transportes`**: Lista opções de transporte disponíveis para uma rota específica em um horário específico.

## 📧 Contato

Para mais informações ou dúvidas, entre em contato:

- **Email**: joaquimnt18@gmail.com
- **GitHub**: [Seu GitHub](https://github.com/joaquim-neto)

---

✨ **API Mobi**: Facilitando o transporte entre cidades! 🚍🛣️
