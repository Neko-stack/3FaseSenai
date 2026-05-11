# PARTE 1: Trabalhando com toThrow e try/catch

## Título da Atividade
Criação de API REST com Node.js, Express e Arquitetura em Camadas (ESM)

## Objetivo
Criar uma API simples em Node.js utilizando o framework Express, aplicando separação de responsabilidades e utilizando ECMAScript Modules (ESM).

---

## Instruções da Entrega

### 1. Configuração Inicial

```bash
npm init -y
npm install express
```

No package.json:

```json
"type": "module",
"start": "node src/server.js"
```

---

### 2. Estrutura do Projeto

```
meu-projeto/
├── package.json
└── src/
    ├── app.js
    ├── server.js
    └── userService.js
```

---

### 3. Regra de Negócio (userService.js)

Função exportada: createUser(userData)

Validações obrigatórias:

Se não existir propriedade name:
throw new Error("O nome do usuário é obrigatório.")

Se age < 18:
throw new Error("O usuário deve ser maior de idade.")

Retorno esperado:

{
  id: gerado_aleatoriamente,
  name: string,
  age: number,
  isActive: true,
  roles: ['user']
}

---

### 4. Express (app.js)

- app.use(express.json())
- Criar rota POST /users
- Retornar 201 em sucesso
- Retornar 400 em erro com:
{ "error": error.message }

---

### 5. Servidor (server.js)

Servidor rodando na porta 3000.

---

# PARTE 2: Documentação

## ENTREGA 01 — Requisitos Funcionais

| ID     | Requisito           | Descrição                                                                 |
|--------|--------------------|---------------------------------------------------------------------------|
| RF-01  |  Criar usuário     |   O sistema deve permitir o cadastro de um usuário via rota POST /users.
| RF-02  |  Validar nome      |   O sistema deve impedir a criação de usuário sem nome.
| RF-03  |  Validar maioridade|   O sistema deve impedir cadastro de usuários menores de 18 anos.

---

# ENTREGA 08 — Descritivo de Casos de Teste

## 8.1 Casos de Teste

| ID Caso | ID Requisito | Descrição                                              | Precondição                  | Passos                                                                 | Resultado Esperado                                                                 |
|---------|-------------|--------------------------------------------------------|------------------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| CT-01   | RF-01      | Criar usuário válido | Servidor rodando | Enviar POST /users com name e age >= 18 |  Retornar 201 com objeto do usuário
| CT-02   | RF-02      | Criar usuário sem nome | Servidor rodando | Enviar POST /users sem name | Retornar 400 com mensagem "O nome do usuário é obrigatório."
| CT-03   | RF-03      |  Criar usuário menor de idade | Servidor rodando | Enviar POST /users com age < 18 | Retornar 400 com mensagem "O usuário deve ser maior de idade."

## 8.2 Ferramentas e Ambiente

Ferramentas:
- Node.js
- Express
- Postman

Ambiente:
- Windows 10
- Node.js v18+
- Terminal VS Code

---

## Observações

- Testes unitários focados em userService
- Cobertura de sucesso e exceções
- Uso de toBe e toEqual
