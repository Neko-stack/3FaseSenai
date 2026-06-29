# Moto Prime

Projeto de teste de sistema para gerenciamento de usuarios e estoque de motos.

## Tecnologias

- React e Vite no frontend
- Node.js e Express no backend
- Prisma ORM
- PostgreSQL
- Jest para testes do backend
- Playwright para testes de sistema

## Banco de dados

Crie um banco PostgreSQL e configure `backend/api/.env` a partir do `.env.example`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/teste?schema=public"
AUTH_SECRET="use-uma-chave-longa"
```

Depois aplique o schema e os dados iniciais:

```bash
cd backend/api
npm install
npm run db:setup
```

A carga inicial cria `admin@motoprime.com` com a senha `123456`, alem do estoque inicial.

## Execucao

Backend:

```bash
cd backend/api
npm run dev
```

Frontend, em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

## Arquitetura

Backend em 4 camadas:

- `routes`: endpoints HTTP.
- `controllers`: entrada e saida HTTP.
- `services`: regras de negocio.
- `repositories`: acesso ao Prisma/PostgreSQL.

Frontend em 4 camadas:

- `App.jsx` e `Login.jsx`: telas/componentes.
- `controllers`: orquestram chamadas da interface.
- `services`: normalizam dados para a UI.
- `repositories`: fazem acesso HTTP e token.

## Testes

O backend possui testes de API com Jest, Express, Prisma e PostgreSQL reais.

```bash
cd backend/api
npm test
```

Os testes de sistema usam Playwright. A suite sobe backend, frontend e acessa o PostgreSQL real, sem simular as rotas HTTP. Tambem existem testes de API no Playwright para validar diretamente o backend.

```bash
cd frontend
npm test
```

O Playwright gera o relatorio HTML em `frontend/playwright-report/index.html`. O PostgreSQL deve estar ativo e o arquivo `backend/api/.env` deve estar configurado antes da execucao.
