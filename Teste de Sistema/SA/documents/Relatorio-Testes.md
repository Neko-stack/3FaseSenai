# Relatorio de Testes - Frontend e Backend

**Sistema:** Moto Prime

**Data:** 29/06/2026

## 1. Objetivo

Registrar a estrutura de testes automatizados do frontend e do backend, as ferramentas utilizadas e o status da tentativa de execucao no ambiente local.

## 2. Frontend

**Ferramenta:** Playwright

**Local dos testes:** `frontend/tests/funcionamento.spec.js`

**Configuracao:** `frontend/playwright.config.js`

**Comando de execucao:**

```bash
cd frontend
npm test
```

**Testes encontrados:**

| Arquivo | Quantidade |
|---|---:|
| `frontend/tests/funcionamento.spec.js` | 4 |

**Cenarios cobertos:**

| ID | Cenario |
|---|---|
| FE-01 | Login valido abre o sistema e logout retorna para a tela de acesso |
| FE-02 | Login invalido mostra erro e nao cria sessao |
| FE-03 | Cadastro de usuario permite login e consulta pelo e-mail |
| FE-04 | Cadastro, alteracao e exclusao de moto funcionam pela interface |

## 3. Backend

**Ferramenta:** Jest

**Local dos testes:** `backend/api/test`

**Configuracao:** script `test` no arquivo `backend/api/package.json`

**Comando de execucao:**

```bash
cd backend/api
npm test
```

**Testes encontrados:**

| Arquivo | Quantidade |
|---|---:|
| `backend/api/test/api.test.js` | 6 |
| `backend/api/test/controllers/moto.controller.test.js` | 5 |
| `backend/api/test/controllers/user.controller.test.js` | 6 |
| `backend/api/test/repositories/moto.repository.test.js` | 6 |
| `backend/api/test/repositories/user.repository.test.js` | 5 |
| `backend/api/test/services/moto.service.test.js` | 5 |
| `backend/api/test/services/user.service.test.js` | 6 |
| **Total** | **39** |

**Camadas cobertas:**

| Camada | Evidencia |
|---|---|
| API | `api.test.js` |
| Controllers | `controllers/*.test.js` |
| Repositories | `repositories/*.test.js` |
| Services | `services/*.test.js` |

## 4. Resultado da execucao local

Foi realizada uma tentativa de executar os testes no ambiente local em 29/06/2026.

| Area | Comando | Resultado |
|---|---|---|
| Frontend | `npm test` em `frontend` | Nao executado com sucesso: binario `playwright` nao encontrado |
| Backend | `npm test` em `backend/api` | Nao executado com sucesso: binario `prisma` nao encontrado |

## 5. Observacao

As pastas `node_modules` nao foram encontradas no frontend nem no backend durante a verificacao. Por isso, os comandos de teste nao conseguiram localizar as ferramentas instaladas pelo projeto.

Para executar os testes em uma maquina preparada, instalar as dependencias antes:

```bash
cd backend/api
npm install
npm test

cd ../../frontend
npm install
npm test
```

## 6. Conclusao

O projeto possui frontend estruturado com Playwright e backend estruturado com Jest. Tambem possui testes automatizados nas duas partes. No ambiente verificado, a execucao dos testes ficou pendente pela ausencia das dependencias instaladas.
