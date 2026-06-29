# Moto Prime API

## Requisitos

- Node.js 20+
- PostgreSQL 16 disponivel em `localhost:5432`

## Execucao

```bash
npm install
npm run db:setup
npm run dev
```

O `db:setup` aplica o schema Prisma e cria a conta de demonstracao
`admin@motoprime.com` com senha `123456`, alem do estoque inicial.

## Estrutura

```text
backend/api/
|-- app.js
|-- prisma/
|   |-- schema.prisma
|   `-- seed.js
|-- src/
|   |-- config/
|   |   |-- db.js
|   |   |-- env.js
|   |   `-- server.js
|   |-- controllers/
|   |   |-- user.controller.js
|   |   `-- moto.controller.js
|   |-- routes/
|   |   |-- user.routes.js
|   |   `-- moto.routes.js
|   |-- repositories/
|   |   |-- user.repository.js
|   |   `-- moto.repository.js
|   `-- services/
|       |-- user.service.js
|       |-- moto.service.js
|       `-- auth.service.js
`-- test/
    |-- api.test.js
    |-- controllers/
    |   |-- user.controller.test.js
    |   `-- moto.controller.test.js
    |-- repositories/
    |   |-- user.repository.test.js
    |   `-- moto.repository.test.js
    `-- services/
        |-- user.service.test.js
        `-- moto.service.test.js
```

As rotas de usuario cobrem login, cadastro, consulta e atualizacao de perfil.
As rotas de moto cobrem listagem, cadastro, edicao e exclusao de motos.

## Arquitetura em 4 camadas

- `routes`: define os endpoints HTTP e middlewares.
- `controllers`: recebe `req/res`, valida entrada e monta respostas.
- `services`: concentra regras de negocio, autenticacao e normalizacao de dados.
- `repositories`: acessa o banco via Prisma.

Em outro terminal, execute o frontend:

```bash
cd ../../frontend
npm install
npm run dev
```

## Verificacao

```bash
npm test
npx prisma validate
```

O comando `npm test` usa Jest. Existem testes unitarios separados por dominio e camada para controllers, services e repositories, alem do teste integrado `api.test.js`, que valida login, cadastro/consulta de usuarios e CRUD de motos contra PostgreSQL real.

Defina `DATABASE_URL` e `AUTH_SECRET` no arquivo `.env`. Em producao, use um segredo longo e exclusivo.
