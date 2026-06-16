# Passo a passo - Back-end

Este guia serve como referencia para criar, configurar e rodar os projetos de back-end desta pasta.

## 1. Entrar na pasta do projeto

Escolha o projeto que deseja executar. Exemplo:

```bash
cd "Desenvolvimento de Sistema/Back/Prova"
```

Se o projeto estiver dentro de outra subpasta, entre nela antes de rodar os comandos.

## 2. Conferir se existe `package.json`

O arquivo `package.json` mostra que o projeto usa Node.js e tambem lista os comandos disponiveis.

```bash
dir
```

Se aparecer `package.json`, instale as dependencias.

## 3. Instalar dependencias

```bash
npm install
```

Esse comando cria a pasta `node_modules` e instala as bibliotecas usadas pelo projeto.

## 4. Montar um projeto back-end do zero

Use este passo a passo quando precisar criar um novo projeto de API.

### 4.1. Criar a pasta do projeto

Entre na pasta `Back` e crie uma nova pasta para o projeto:

```bash
cd "Desenvolvimento de Sistema/Back"
mkdir meu-backend
cd meu-backend
```

### 4.2. Iniciar o Node.js

Crie o arquivo `package.json`:

```bash
npm init -y
```

### 4.3. Instalar bibliotecas principais

Para uma API com Express:

```bash
npm install express
```

Se for usar MySQL:

```bash
npm install mysql2
```

Se precisar liberar acesso do front-end:

```bash
npm install cors
```

### 4.4. Criar a estrutura de pastas

Uma estrutura simples pode ser:

```txt
meu-backend/
  src/
    index.js
    routes/
    controllers/
    database/
  package.json
```

### 4.5. Configurar o `package.json`

No `package.json`, deixe o projeto como modulo e crie o script de inicio:

```json
{
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  }
}
```

### 4.6. Criar o servidor principal

No arquivo `src/index.js`, monte a base do servidor:

```js
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
```

### 4.7. Criar as rotas

Crie rotas para cada recurso do sistema. Exemplo:

```txt
GET /usuarios
POST /usuarios
PUT /usuarios/:id
DELETE /usuarios/:id
```

### 4.8. Conectar ao banco de dados

Se o projeto usar banco, crie um arquivo de conexao dentro de `src/database`.

Depois disso:

1. Configure host, usuario, senha e nome do banco.
2. Crie as tabelas no banco.
3. Teste uma rota que consulta o banco.

### 4.9. Testar o projeto

Rode:

```bash
npm start
```

Depois teste no navegador ou em uma ferramenta como Postman, Insomnia ou Thunder Client.

## 5. Configurar banco de dados, se necessario

Alguns projetos usam banco de dados, como MySQL ou arquivos JSON. Antes de iniciar:

1. Abra o arquivo principal do projeto, normalmente em `src`.
2. Procure arquivos de configuracao de conexao com banco.
3. Confira usuario, senha, nome do banco e porta.
4. Crie o banco e as tabelas, caso o projeto tenha uma pasta `DB` ou scripts SQL.

Exemplo de itens para conferir:

```txt
host
user
password
database
port
```

## 6. Rodar o projeto

Veja os scripts no `package.json`. Um exemplo comum nesta pasta e:

```bash
npm start
```

Se existir outro script, como `dev`, use:

```bash
npm run dev
```

## 7. Testar a API

Depois que o servidor iniciar, teste as rotas com:

1. Navegador, quando a rota for simples.
2. Postman, Insomnia ou Thunder Client.
3. Requisicoes `GET`, `POST`, `PUT` e `DELETE`, conforme o projeto.

Exemplo de URL local:

```txt
http://localhost:3000
```

## 8. Criar uma nova funcionalidade

Fluxo recomendado:

1. Criar ou alterar a rota.
2. Criar ou alterar o controller.
3. Criar ou alterar a funcao que acessa o banco.
4. Testar a rota.
5. Conferir se o front-end consegue consumir a resposta.

## 9. Corrigir erros comuns

Se aparecer erro de modulo nao encontrado:

```bash
npm install
```

Se aparecer erro de porta ocupada, feche o servidor antigo ou altere a porta no projeto.

Se aparecer erro de banco, confira se o banco esta ligado e se os dados de conexao estao corretos.

## 10. Antes de entregar

Confira:

1. O projeto inicia sem erro.
2. As rotas principais respondem corretamente.
3. O banco esta com os dados/tabelas necessarios.
4. O codigo esta salvo.
5. O front-end sabe qual URL da API deve usar.
