import { jest } from '@jest/globals';
import http from 'http';

const executeMock = jest.fn();

jest.unstable_mockModule('../db/db.js', () => ({
  pool: {
    execute: executeMock,
  },
}));

const { app } = await import('../app.js');

function request(server, method, path, body) {
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
    executeMock.mockReset();
  });

  test('POST /api/login retorna usuario quando as credenciais existem', async () => {
    executeMock.mockResolvedValueOnce([
      [{ id: 1, nome: 'Administrador', email: 'admin@motoprime.com' }],
    ]);

    const response = await request(server, 'POST', '/api/login', {
      email: 'admin@motoprime.com',
      senha: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login realizado!',
      token: 'token',
      usuario: { id: 1, nome: 'Administrador', email: 'admin@motoprime.com' },
    });
    expect(executeMock).toHaveBeenCalledWith(
      'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
      ['admin@motoprime.com', '123456']
    );
  });

  test('POST /api/login retorna 401 para credenciais invalidas', async () => {
    executeMock.mockResolvedValueOnce([[]]);

    const response = await request(server, 'POST', '/api/login', {
      email: 'erro@motoprime.com',
      senha: 'errada',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'E-mail ou senha incorretos.' });
  });

  test('GET /api/motos lista todas as motos sem busca', async () => {
    const motos = [
      { id: 1, marca: 'Honda', modelo: 'CB 500F' },
      { id: 2, marca: 'Yamaha', modelo: 'MT-03' },
    ];
    executeMock.mockResolvedValueOnce([motos]);

    const response = await request(server, 'GET', '/api/motos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(motos);
    expect(executeMock).toHaveBeenCalledWith('SELECT * FROM motos', []);
  });

  test('GET /api/motos filtra por modelo ou marca', async () => {
    const motos = [{ id: 4, marca: 'Kawasaki', modelo: 'Ninja 400' }];
    executeMock.mockResolvedValueOnce([motos]);

    const response = await request(server, 'GET', '/api/motos?busca=ninja');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(motos);
    expect(executeMock).toHaveBeenCalledWith(
      'SELECT * FROM motos WHERE modelo LIKE ? OR marca LIKE ?',
      ['%ninja%', '%ninja%']
    );
  });

  test('GET /api/motos retorna 500 quando o banco falha', async () => {
    executeMock.mockRejectedValueOnce(new Error('database offline'));

    const response = await request(server, 'GET', '/api/motos');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao buscar motos' });
  });
});
