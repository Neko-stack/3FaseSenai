# Passo a passo - Front-end

Este guia serve como referencia para criar, configurar e rodar os projetos de front-end desta pasta.

## 1. Entrar na pasta do projeto

Escolha o projeto que deseja executar. Exemplo:

```bash
cd "Desenvolvimento de Sistema/Front/clinica"
```

Tambem existem outros projetos, como `fundamentos`, `aula-fundamentos` e `multi-pages`.

## 2. Conferir se existe `package.json`

O arquivo `package.json` indica que o projeto usa Node.js, React e Vite.

```bash
dir
```

Se aparecer `package.json`, siga para a instalacao.

## 3. Instalar dependencias

```bash
npm install
```

Esse comando instala as bibliotecas usadas pelo front-end, como React, Vite, Tailwind, Axios ou React Router, dependendo do projeto.

## 4. Montar um projeto front-end do zero

Use este passo a passo quando precisar criar um novo projeto React com Vite.

### 4.1. Criar o projeto com Vite

Entre na pasta `Front` e rode:

```bash
cd "Desenvolvimento de Sistema/Front"
npm create vite@latest meu-front
```

Quando aparecerem as opcoes:

1. Escolha `React`.
2. Escolha `JavaScript`, se o professor nao pedir TypeScript.
3. Entre na pasta criada.

```bash
cd meu-front
```

### 4.2. Instalar dependencias

```bash
npm install
```

### 4.3. Rodar pela primeira vez

```bash
npm run dev
```

Abra o endereco mostrado no terminal, normalmente:

```txt
http://localhost:5173
```

### 4.4. Organizar a estrutura de pastas

Uma estrutura simples pode ser:

```txt
meu-front/
  src/
    components/
    pages/
    services/
    App.jsx
    main.jsx
  package.json
```

Use:

1. `components` para partes reutilizaveis, como botoes, cards e formularios.
2. `pages` para telas completas.
3. `services` para chamadas de API.

### 4.5. Limpar arquivos iniciais

Depois de criar o projeto, remova conteudos de exemplo que nao serao usados.

Normalmente voce pode ajustar:

```txt
src/App.jsx
src/App.css
src/index.css
```

Mantenha apenas o que for necessario para a sua tela.

### 4.6. Criar a primeira tela

No `App.jsx`, monte a tela inicial do sistema. Exemplo:

```jsx
function App() {
  return (
    <main>
      <h1>Meu sistema</h1>
    </main>
  );
}

export default App;
```

### 4.7. Instalar bibliotecas extras, se precisar

Para consumir API com Axios:

```bash
npm install axios
```

Para criar rotas entre paginas:

```bash
npm install react-router
```

Para simular uma API com JSON Server:

```bash
npm install json-server
```

### 4.8. Conectar com o back-end

Crie um arquivo dentro de `src/services` para concentrar a URL da API.

Exemplo de organizacao:

```txt
src/services/api.js
```

Nesse arquivo, deixe configurado o endereco do back-end, como `http://localhost:3000`.

### 4.9. Testar no navegador

Sempre que criar uma tela ou componente:

1. Rode `npm run dev`.
2. Abra o navegador.
3. Teste botoes, formularios, links e mensagens.
4. Confira se aparecem erros no terminal ou no console do navegador.

## 5. Rodar o front-end

Na maioria dos projetos desta pasta, use:

```bash
npm run dev
```

O Vite vai mostrar um endereco parecido com:

```txt
http://localhost:5173
```

Abra esse endereco no navegador.

## 6. Rodar servidor JSON, se o projeto usar

Alguns projetos tem um script chamado `server` para simular uma API com `json-server`.

```bash
npm run server
```

Deixe esse comando rodando em um terminal separado. Em outro terminal, rode o front-end com:

```bash
npm run dev
```

## 7. Organizar uma nova tela ou funcionalidade

Fluxo recomendado:

1. Criar ou alterar o componente em `src`.
2. Criar ou alterar a pagina, se o projeto usar paginas.
3. Configurar a rota, se o projeto usar React Router.
4. Criar ou ajustar servicos de API.
5. Testar no navegador.

## 8. Consumir dados do back-end

Quando o front-end precisar buscar dados:

1. Confirme se o back-end esta rodando.
2. Confira a URL da API.
3. Use `fetch` ou `axios`, de acordo com o padrao do projeto.
4. Trate carregamento, sucesso e erro.

Exemplo de URL local:

```txt
http://localhost:3000
```

## 9. Corrigir erros comuns

Se aparecer erro de dependencias:

```bash
npm install
```

Se o navegador nao abrir a tela correta, confira o terminal do Vite e use o endereco exibido nele.

Se o front nao carregar dados, confira se a API ou o `json-server` estao rodando.

## 10. Antes de entregar

Confira:

1. O projeto inicia sem erro.
2. As telas principais abrem no navegador.
3. Os botoes, formularios e links funcionam.
4. A integracao com API ou `json-server` funciona.
5. O codigo esta salvo.
