# Moto Prime

Projeto de teste de sistema para gerenciamento de usuarios e estoque de motos.

## Tecnologias

- React e Vite no frontend
- Node.js e Express no backend
- Prisma ORM
- PostgreSQL
- Playwright para testes de interface
- Jest para testes da API

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

A carga inicial cria `admin@motoprime.com` com a senha `123456` para demonstracao.

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

## Testes

Os testes da API incluem uma suíte isolada e uma suíte integrada ao PostgreSQL real. Os testes de interface iniciam frontend e backend e acessam o mesmo banco, sem simulação das rotas HTTP.

```bash
cd backend/api
npm test

cd ../../frontend
npm test
```

O Playwright também gera o relatório `frontend/playwright-report/index.html`. O PostgreSQL deve estar ativo e o arquivo `backend/api/.env` deve estar configurado antes da execução.
