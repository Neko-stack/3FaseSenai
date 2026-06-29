# ENTREGA 8 - Descritivo de Casos de Teste de Software

**Sistema:** Moto Prime
**Objetivo:** validar os fluxos de login, cadastro de usuario, consulta de usuario e cadastro de moto em condicoes de sucesso e erro.

## 8.1 Casos de teste

| ID | Requisito | Cenario | Pre-condicao | Passos principais | Resultado esperado | Automacao |
|---|---|---|---|---|---|---|
| CT-01 | RF-Login | Login com credenciais validas | Usuario administrador cadastrado | Acessar o sistema; informar e-mail e senha validos; entrar | Catalogo exibido e token de sessao criado | Playwright |
| CT-02 | RF-Login | Login com senha incorreta | Usuario cadastrado | Informar e-mail valido e senha incorreta; entrar | Mensagem de credenciais incorretas; sessao nao criada | Playwright |
| CT-03 | RF-Cadastro-Usuario | Cadastro com dados validos | E-mail ainda nao cadastrado | Abrir Cadastro; preencher nome, e-mail e senha; cadastrar | Usuario persistido e apto a realizar login | Playwright |
| CT-04 | RF-Cadastro-Usuario | Cadastro com e-mail duplicado | E-mail ja cadastrado | Preencher o cadastro com e-mail existente; cadastrar | Cadastro rejeitado com mensagem explicativa | Playwright |
| CT-05 | RF-Consulta-Usuario | Consulta por nome ou e-mail | Usuario cadastrado | Entrar no sistema; abrir Usuario; pesquisar pelo e-mail | Usuario exibido na lista de consulta | Playwright |
| CT-06 | RF-Consulta-Usuario | Consulta sem resultado | Usuario autenticado | Pesquisar termo inexistente | Mensagem de nenhum usuario encontrado | Playwright |
| CT-07 | RF-Cadastro-Moto | Cadastro com dados validos | Usuario autenticado | Abrir Cadastrar moto; preencher os campos; salvar | Moto persistida e exibida no catalogo | Playwright |
| CT-08 | RF-Cadastro-Moto | Cadastro com ano invalido | Usuario autenticado | Preencher ano inferior a 1900; salvar | Formulario impede o cadastro | Playwright |
| CT-09 | RF-Cadastro-Moto | Alteracao de moto | Moto cadastrada pelo usuario | Abrir edicao; alterar a cor; salvar | Alteracao persistida e exibida | Playwright |
| CT-10 | RF-Cadastro-Moto | Exclusao de moto | Moto cadastrada pelo usuario | Excluir e confirmar | Moto removida do banco e do catalogo | Playwright |
| CT-11 | RF-Compra | Compra e remocao de compra local | Usuario autenticado | Comprar moto; abrir Usuario; remover compra | Moto volta a ficar disponivel para compra | Playwright |
| CT-12 | RF-Login | Logout | Usuario autenticado | Clicar em Sair | Token removido e tela de login exibida | Playwright |

## 8.2 Niveis e tecnicas de teste

- **Testes de sistema:** o Playwright controla o navegador e utiliza frontend, backend, Prisma e PostgreSQL reais.
- **Testes de API do backend:** o backend tambem possui testes com Jest, Express, Prisma e PostgreSQL reais.
- **Testes de API no Playwright:** o Playwright tambem chama diretamente as rotas do backend para validar login, usuarios e motos.
- **Sem simulacao de API:** os fluxos passam pelas rotas `/api/login`, `/api/usuarios` e `/api/motos`.
- **Tecnicas aplicadas:** particionamento de equivalencia para credenciais validas e invalidas, analise de valor limite para ano, transicao de estado para login/logout e testes CRUD para motos.

## 8.3 Ferramentas e ambiente

- Google Chrome/Chromium controlado pelo Playwright;
- Jest para testes de API do backend;
- Node.js e Express;
- Prisma ORM;
- PostgreSQL;
