# ENTREGA 8 — Descritivo de Casos de Teste de Software

**Sistema:** Moto Prime
**Objetivo:** validar os fluxos de login, cadastro de usuário e cadastro de moto em condições de sucesso e erro.

## 8.1 Casos de teste

| ID | Requisito | Cenário | Pré-condição | Passos principais | Resultado esperado | Automação |
|---|---|---|---|---|---|---|
| CT-01 | RF-Login | Login com credenciais válidas | Usuário administrador cadastrado | Acessar o sistema; informar e-mail e senha válidos; entrar | Catálogo exibido e token de sessão criado | Playwright e Jest integrado |
| CT-02 | RF-Login | Login com senha incorreta | Usuário cadastrado | Informar e-mail válido e senha incorreta; entrar | Mensagem de credenciais incorretas; sessão não criada | Playwright e Jest integrado |
| CT-03 | RF-Login | Login sem campos obrigatórios | Nenhuma | Enviar login sem e-mail ou senha | Requisição rejeitada com status 400 | Jest unitário |
| CT-04 | RF-Cadastro-Usuário | Cadastro com dados válidos | E-mail ainda não cadastrado | Abrir Cadastro; preencher nome, e-mail e senha; cadastrar | Usuário persistido e apto a realizar login | Playwright e Jest integrado |
| CT-05 | RF-Cadastro-Usuário | Cadastro com e-mail duplicado | E-mail já cadastrado | Preencher o cadastro com e-mail existente; cadastrar | Cadastro rejeitado com status 409 e mensagem explicativa | Playwright e Jest integrado |
| CT-06 | RF-Cadastro-Usuário | Cadastro com senha curta | Nenhuma | Informar senha com menos de seis caracteres; cadastrar | Cadastro rejeitado com status 400 | Jest integrado |
| CT-07 | RF-Cadastro-Moto | Cadastro com dados válidos | Usuário autenticado | Abrir Cadastrar moto; preencher os campos; salvar | Moto persistida e exibida no catálogo | Playwright e Jest integrado |
| CT-08 | RF-Cadastro-Moto | Cadastro sem autenticação | Usuário não autenticado | Enviar requisição de cadastro de moto sem token | Requisição rejeitada com status 401 | Jest unitário e integrado |
| CT-09 | RF-Cadastro-Moto | Cadastro com ano inválido | Usuário autenticado | Preencher ano inferior a 1900; salvar | Formulário ou API impede o cadastro | Playwright e Jest integrado |
| CT-10 | RF-Cadastro-Moto | Cadastro de moto duplicada | Moto com mesma marca e modelo cadastrada | Repetir o cadastro da mesma moto | Cadastro rejeitado com status 409 | Jest integrado |
| CT-11 | RF-Cadastro-Moto | Alteração de moto | Moto cadastrada e usuário autenticado | Abrir edição; alterar a cor; salvar | Alteração persistida e exibida | Playwright e Jest integrado |
| CT-12 | RF-Cadastro-Moto | Exclusão de moto | Moto cadastrada e usuário autenticado | Excluir e confirmar | Moto removida do banco e do catálogo | Playwright e Jest integrado |
| CT-13 | RF-Login | Logout | Usuário autenticado | Clicar em Sair | Token removido e tela de login exibida | Playwright |

## 8.2 Níveis e técnicas de teste

- **Testes unitários de API:** executam as rotas com dependências do Prisma simuladas para validar regras, códigos HTTP e tratamento de erros de forma isolada.
- **Testes de integração:** executam Express, Prisma e PostgreSQL reais. Os dados recebem identificadores únicos e são removidos ao final da suíte.
- **Testes de sistema:** o Playwright controla o navegador e utiliza frontend, backend e PostgreSQL reais. Não há interceptação ou simulação das rotas `/api`.
- **Técnicas aplicadas:** particionamento de equivalência para credenciais válidas e inválidas, análise de valor limite para senha e ano, transição de estado para login/logout e testes CRUD para motos.

## 8.3 Ferramentas e ambiente

- Google Chrome/Chromium controlado pelo Playwright;
- Jest para testes da API;
- Node.js e Express;
- Prisma ORM;
- PostgreSQL;
- relatório HTML do Playwright em `frontend/playwright-report/index.html`.


