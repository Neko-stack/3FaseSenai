
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
