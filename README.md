# API Mobi

API Mobi é uma aplicação server-side construída com o framework [NestJS](https://nestjs.com/). Esta API gerencia informações sobre meios de transportes disponíveis entre cidades, incluindo rotas, horários, preços, veículos e empresas de transportes que operam entre cidades de uma região.

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

## Descrição dos Módulos

### Usuários

- **Controller**: users.controller.ts
- **Service**: users.service.ts
- **Repository**: users.repository.ts
- **DTOs**: dto
- **Entidade**: user.entity.ts

### Empresas

- **Controller**: company.controller.ts
- **Service**: company.service.ts
- **Repository**: company.repository.ts
- **DTOs**: dtos
- **Entidade**: company.entity.ts

### Veículos

- **Controller**: vehicles.controller.ts
- **Service**: vehicles.service.ts
- **Repository**: vehicles.repository.ts
- **DTOs**: dto
- **Entidade**: vehicle.entity.ts

### Transportes

- **Controller**: transports.controller.ts
- **Service**: transports.service.ts
- **Repository**: transports.repository.ts
- **DTOs**: dto
- **Entidade**: transport.entity.ts

### Cidades

- **Controller**: `src/city/city.controller.ts`
- **Service**: city.service.ts
- **Repository**: city.repository.ts
- **Entidade**: city.ts

### Comum

- **Database Module**: database.module.ts
- **Database Types**: types.ts

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

## Licença

Este projeto é licenciado sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/nestjs/nest/blob/master/LICENSE) para mais detalhes.
```

Este README atualizado inclui informações sobre o propósito do projeto, a estrutura do projeto, instruções de instalação e execução, detalhes dos módulos principais, configuração do banco de dados, e a inicialização da aplicação.
Este README atualizado inclui informações sobre o propósito do projeto, a estrutura do projeto, instruções de instalação e execução, detalhes dos módulos principais, configuração do banco de dados, e a inicialização da aplicação.

Similar code found with 1 license type

## Instalação

Certifique-se de ter o [Node.js](https://nodejs.org/) versão 20 instalada.

```bash
$ yarn install