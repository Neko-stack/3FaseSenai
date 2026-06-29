import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { app } from '../app.js';
import { prisma } from '../src/config/db.js';

const SENHA = '123456';
const ADMIN_EMAIL = 'admin@motoprime.com';
const execucao = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const emailTeste = `backend.${execucao}@motoprime.com`;
const modeloTeste = `BACKEND-${execucao}`;

let server;
let baseUrl;
let tokenAdmin;

async function request(method, path, body, headers = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return {
    status: response.status,
    body: data,
  };
}

describe('API backend', () => {
  beforeAll(async () => {
    await prisma.$connect();
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}/api`;
  });

  afterAll(async () => {
    await prisma.moto.deleteMany({ where: { modelo: { startsWith: 'BACKEND-' } } });
    await prisma.usuario.deleteMany({ where: { email: { startsWith: 'backend.' } } });
    await new Promise((resolve) => server.close(resolve));
    await prisma.$disconnect();
  });

  test('login retorna token para credenciais validas', async () => {
    const response = await request('POST', '/login', {
      email: ADMIN_EMAIL,
      senha: SENHA,
    });

    expect(response.status).toBe(200);
    expect(response.body.usuario.email).toBe(ADMIN_EMAIL);
    expect(response.body.usuario.nome).toBe('Administrador');
    expect(typeof response.body.token).toBe('string');

    tokenAdmin = response.body.token;
  });

  test('login rejeita senha incorreta', async () => {
    const response = await request('POST', '/login', {
      email: ADMIN_EMAIL,
      senha: 'senha-errada',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'E-mail ou senha incorretos.' });
  });

  test('cadastra usuario, rejeita duplicado e consulta sem expor senha', async () => {
    const dados = {
      nome: 'Usuario Backend Teste',
      email: emailTeste,
      senha: SENHA,
    };

    const cadastro = await request('POST', '/usuarios', dados);
    const duplicado = await request('POST', '/usuarios', dados);
    const consulta = await request('GET', `/usuarios?busca=${encodeURIComponent(emailTeste)}`);

    expect(cadastro.status).toBe(201);
    expect(cadastro.body.usuario.email).toBe(emailTeste);
    expect(duplicado.status).toBe(409);
    expect(duplicado.body).toEqual({ error: 'Este e-mail ja esta cadastrado.' });
    expect(consulta.status).toBe(200);
    expect(consulta.body).toHaveLength(1);
    expect(consulta.body[0].email).toBe(emailTeste);
    expect(consulta.body[0]).not.toHaveProperty('senha');
  });

  test('cadastro de usuario valida senha curta', async () => {
    const response = await request('POST', '/usuarios', {
      nome: 'Senha Curta',
      email: `curta.${emailTeste}`,
      senha: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  });

  test('motos exigem autenticacao para cadastro', async () => {
    const response = await request('POST', '/motos', {});

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Autenticacao obrigatoria.' });
  });

  test('cadastra, consulta, altera e exclui moto autenticada', async () => {
    const dadosMoto = {
      marca: 'Suzuki',
      modelo: modeloTeste,
      categoria: 'Street',
      ano: 2024,
      cor: 'Preta',
      preco: 45900,
      quilometragem: 300,
      cilindradas: 650,
      imagem: '',
      descricao: 'Teste backend',
      destaque: false,
    };
    const auth = { Authorization: `Bearer ${tokenAdmin}` };

    const cadastro = await request('POST', '/motos', dadosMoto, auth);
    const consulta = await request('GET', `/motos?busca=${encodeURIComponent(modeloTeste)}`);
    const alteracao = await request('PUT', `/motos/${cadastro.body.id}`, { ...dadosMoto, cor: 'Azul' }, auth);
    const exclusao = await request('DELETE', `/motos/${cadastro.body.id}`, null, auth);
    const consultaFinal = await request('GET', `/motos?busca=${encodeURIComponent(modeloTeste)}`);

    expect(cadastro.status).toBe(201);
    expect(cadastro.body.modelo).toBe(modeloTeste);
    expect(consulta.status).toBe(200);
    expect(consulta.body).toHaveLength(1);
    expect(alteracao.status).toBe(200);
    expect(alteracao.body.cor).toBe('Azul');
    expect(exclusao.status).toBe(204);
    expect(consultaFinal.body).toEqual([]);
  });
});
