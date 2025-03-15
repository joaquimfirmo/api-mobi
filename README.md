# API Mobi

API Mobi é uma aplicação server-side construída com o framework [NestJS](https://nestjs.com/). Esta API gerencia informações sobre meios de transportes disponíveis entre cidades, incluindo rotas, horários, preços, veículos e empresas de transportes que operam entre cidades de uma determinada região.

## Estrutura do Projeto

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
  transports/
  users/
  vehicles/
test/
tsconfig.build.json
tsconfig.json
```

## Instalação

Certifique-se de ter o [Node.js](https://nodejs.org/) versão 20 instalada.

```bash
$ yarn install
```

## Executando a Aplicação

```bash
# desenvolvimento
$ yarn run start

# modo watch
$ yarn run start:dev

# produção
$ yarn run start:prod
```

## Testes

```bash
# testes unitários
$ yarn run test

# testes end-to-end
$ yarn run test:e2e

# cobertura de testes
$ yarn run test:cov
```

## Configuração do Banco de Dados

A conexão com o banco de dados é configurada no arquivo database.providers.ts. Certifique-se de definir as variáveis de ambiente no arquivo .env:

```
BD_USER=<seu_usuario>
BD_HOST=<seu_host>
BD_DATABASE=<seu_banco_de_dados>
BD_PASSWORD=<sua_senha>
BD_PORT=<sua_porta>
```

Este projeto utiliza o banco de dados PostgreSQL e o query builder Kysely.

## Inicialização da Aplicação

O ponto de entrada da aplicação é o arquivo main.ts, que configura o NestJS e inicia o servidor na porta 8080:

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

## Instalação

Certifique-se de ter o [Node.js](https://nodejs.org/) versão 20 instalada.

```bash
$ yarn install
```

## Contato

Para mais informações ou dúvidas, entre em contato:

:computer: Email: joaquimnt18@gmail.com
