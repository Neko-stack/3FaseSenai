import { jest } from '@jest/globals';
import { scryptSync } from 'crypto';
import http from 'http';

const motoFindManyMock = jest.fn();
const motoCreateMock = jest.fn();
const motoUpdateMock = jest.fn();
const motoDeleteMock = jest.fn();
const usuarioFindUniqueMock = jest.fn();
const usuarioCreateMock = jest.fn();

jest.unstable_mockModule('../db/db.js', () => ({
  prisma: {
    moto: {
      findMany: motoFindManyMock,
      create: motoCreateMock,
      update: motoUpdateMock,
      delete: motoDeleteMock,
    },
    usuario: {
      findUnique: usuarioFindUniqueMock,
      create: usuarioCreateMock,
    },
  },
}));

const { app } = await import('../app.js');
const { criarToken } = await import('../services/authService.js');

function hashSenha(senha, salt = '0123456789abcdef0123456789abcdef') {
  return `scrypt$${salt}$${scryptSync(senha, salt, 64).toString('hex')}`;
}

function request(server, method, path, body, headers = {}) {
  const payload = body ? JSON.stringify(body) : null;
  const { port } = server.address();

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          ...(payload ? { 'Content-Type': 'application/json' } : {}),
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

describe('API de motos', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    motoFindManyMock.mockReset();
    motoCreateMock.mockReset();
    motoUpdateMock.mockReset();
    motoDeleteMock.mockReset();
    usuarioFindUniqueMock.mockReset();
    usuarioCreateMock.mockReset();
  });

  test('POST /api/login valida campos obrigatorios', async () => {
    const response = await request(server, 'POST', '/api/login', {
      email: 'admin@motoprime.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'E-mail e senha sao obrigatorios.' });
    expect(usuarioFindUniqueMock).not.toHaveBeenCalled();
  });

  test('POST /api/login retorna usuario quando as credenciais existem', async () => {
    usuarioFindUniqueMock.mockResolvedValueOnce({
      id: 1,
      nome: 'Administrador',
      email: 'admin@motoprime.com',
      senha: hashSenha('123456'),
    });

    const response = await request(server, 'POST', '/api/login', {
      email: 'admin@motoprime.com',
      senha: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login realizado!',
      token: expect.stringMatching(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/),
      usuario: { id: 1, nome: 'Administrador', email: 'admin@motoprime.com' },
    });
    expect(usuarioFindUniqueMock).toHaveBeenCalledWith({
      where: { email: 'admin@motoprime.com' },
      select: { id: true, nome: true, email: true, senha: true },
    });
  });

  test('POST /api/login retorna 401 para credenciais invalidas', async () => {
    usuarioFindUniqueMock.mockResolvedValueOnce({
      id: 1,
      nome: 'Administrador',
      email: 'admin@motoprime.com',
      senha: hashSenha('123456'),
    });

    const response = await request(server, 'POST', '/api/login', {
      email: 'erro@motoprime.com',
      senha: 'errada',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'E-mail ou senha incorretos.' });
  });

  test('POST /api/usuarios cadastra usuario quando e-mail ainda nao existe', async () => {
    usuarioFindUniqueMock.mockResolvedValueOnce(null);
    usuarioCreateMock.mockResolvedValueOnce({
      id: 5,
      nome: 'Maria Cliente',
      email: 'maria@motoprime.com',
    });

    const response = await request(server, 'POST', '/api/usuarios', {
      nome: 'Maria Cliente',
      email: 'maria@motoprime.com',
      senha: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Usuario cadastrado!',
      usuario: {
        id: 5,
        nome: 'Maria Cliente',
        email: 'maria@motoprime.com',
      },
    });
    expect(usuarioFindUniqueMock).toHaveBeenCalledWith({
      where: { email: 'maria@motoprime.com' },
      select: { id: true, nome: true, email: true },
    });
    expect(usuarioCreateMock).toHaveBeenCalledWith({
      data: {
        nome: 'Maria Cliente',
        email: 'maria@motoprime.com',
        senha: expect.stringMatching(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/),
      },
      select: { id: true, nome: true, email: true },
    });
  });

  test('POST /api/usuarios retorna 409 quando e-mail ja existe', async () => {
    usuarioFindUniqueMock.mockResolvedValueOnce({
      id: 1,
      nome: 'Administrador',
      email: 'admin@motoprime.com',
    });

    const response = await request(server, 'POST', '/api/usuarios', {
      nome: 'Administrador',
      email: 'admin@motoprime.com',
      senha: '123456',
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Este e-mail ja esta cadastrado.' });
    expect(usuarioFindUniqueMock).toHaveBeenCalledTimes(1);
    expect(usuarioCreateMock).not.toHaveBeenCalled();
  });

  test('GET /api/motos lista todas as motos sem busca', async () => {
    const motos = [
      { id: 1, marca: 'Honda', modelo: 'CB 500F' },
      { id: 2, marca: 'Yamaha', modelo: 'MT-03' },
    ];
    motoFindManyMock.mockResolvedValueOnce(motos);

    const response = await request(server, 'GET', '/api/motos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(motos);
    expect(motoFindManyMock).toHaveBeenCalledWith({ where: undefined });
  });

  test('GET /api/motos filtra por modelo ou marca', async () => {
    const motos = [{ id: 4, marca: 'Kawasaki', modelo: 'Ninja 400' }];
    motoFindManyMock.mockResolvedValueOnce(motos);

    const response = await request(server, 'GET', '/api/motos?busca=ninja');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(motos);
    expect(motoFindManyMock).toHaveBeenCalledWith({
      where: {
        OR: [
          { modelo: { contains: 'ninja', mode: 'insensitive' } },
          { marca: { contains: 'ninja', mode: 'insensitive' } },
        ],
      },
    });
  });

  test('GET /api/motos retorna 500 quando o banco falha', async () => {
    motoFindManyMock.mockRejectedValueOnce(new Error('database offline'));

    const response = await request(server, 'GET', '/api/motos');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao buscar motos' });
  });

  test('POST /api/motos exige autenticacao', async () => {
    const response = await request(server, 'POST', '/api/motos', {});
    expect(response.status).toBe(401);
    expect(motoCreateMock).not.toHaveBeenCalled();
  });

  test('POST e PUT /api/motos persistem dados validos', async () => {
    const dados = { marca: 'Honda', modelo: 'CG 160', categoria: 'Street', ano: 2025, cor: 'Preta', preco: 22000, quilometragem: 0, cilindradas: 160, imagem: '', descricao: '', destaque: false };
    const salvo = { id: 10, ...dados, imagem: null, descricao: null };
    const headers = { Authorization: `Bearer ${criarToken({ id: 1 })}` };
    motoCreateMock.mockResolvedValueOnce(salvo);
    motoUpdateMock.mockResolvedValueOnce({ ...salvo, cor: 'Vermelha' });

    const cadastro = await request(server, 'POST', '/api/motos', dados, headers);
    const alteracao = await request(server, 'PUT', '/api/motos/10', { ...dados, cor: 'Vermelha' }, headers);

    expect(cadastro.status).toBe(201);
    expect(alteracao.status).toBe(200);
    expect(motoCreateMock).toHaveBeenCalledWith({ data: { ...dados, imagem: null, descricao: null } });
    expect(motoUpdateMock).toHaveBeenCalledWith({ where: { id: 10 }, data: { ...dados, cor: 'Vermelha', imagem: null, descricao: null } });
  });

  test('DELETE /api/motos remove uma moto autenticada', async () => {
    motoDeleteMock.mockResolvedValueOnce({ id: 10 });
    const response = await request(server, 'DELETE', '/api/motos/10', null, {
      Authorization: `Bearer ${criarToken({ id: 1 })}`,
    });
    expect(response.status).toBe(204);
    expect(motoDeleteMock).toHaveBeenCalledWith({ where: { id: 10 } });
  });
});
