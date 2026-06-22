# Moto Prime API

## Requisitos

- Node.js 20+
- PostgreSQL 16 disponível em `localhost:5432`

## Execução

```bash
npm install
npm run db:setup
npm run dev
```

O `db:setup` aplica o schema Prisma e cria a conta de demonstração
`admin@motoprime.com` com senha `123456`, além do estoque inicial.

Em outro terminal, execute o frontend:

```bash
cd ../../frontend
npm install
npm run dev
```

## Verificação

```bash
npm test
npx prisma validate
```

Defina `DATABASE_URL` e `AUTH_SECRET` no arquivo `.env`. Em produção, use um segredo longo e exclusivo.
