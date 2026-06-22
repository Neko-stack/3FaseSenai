import http from 'http';
import { app } from '../app.js';
import { prisma } from '../db/db.js';

const execucao = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const email = `teste.integracao.${execucao}@motoprime.com`;
const modelo = `INTEGRACAO-${execucao}`;

function request(server, method, path, body, headers = {}) {
  const payload = body ? JSON.stringify(body) : null;
  const { port } = server.address();

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

describe('API integrada ao PostgreSQL', () => {
  let server;
  let token;

  beforeAll(async () => {
    await prisma.$connect();
    server = app.listen(0);
  });

  afterAll(async () => {
    await prisma.moto.deleteMany({ where: { modelo: { startsWith: 'INTEGRACAO-' } } });
    await prisma.usuario.deleteMany({ where: { email: { startsWith: 'teste.integracao.' } } });
    await new Promise((resolve) => server.close(resolve));
    await prisma.$disconnect();
  });

  test('cadastra usuário no banco e rejeita e-mail duplicado', async () => {
    const dados = { nome: 'Usuário Integração', email, senha: '123456' };
    const cadastro = await request(server, 'POST', '/api/usuarios', dados);
    const duplicado = await request(server, 'POST', '/api/usuarios', dados);
    const salvo = await prisma.usuario.findUnique({ where: { email } });

    expect(cadastro.status).toBe(201);
    expect(duplicado).toEqual({ status: 409, body: { error: 'Este e-mail ja esta cadastrado.' } });
    expect(salvo).toMatchObject({ nome: dados.nome, email });
    expect(salvo.senha).not.toBe(dados.senha);
  });

  test('rejeita cadastro com senha curta', async () => {
    const response = await request(server, 'POST', '/api/usuarios', {
      nome: 'Senha Curta', email: `curta.${email}`, senha: '123',
    });
    expect(response).toEqual({ status: 400, body: { error: 'A senha deve ter pelo menos 6 caracteres.' } });
  });

  test('realiza login com senha válida e rejeita senha incorreta', async () => {
    const login = await request(server, 'POST', '/api/login', { email, senha: '123456' });
    const invalido = await request(server, 'POST', '/api/login', { email, senha: 'senha-errada' });

    expect(login.status).toBe(200);
    expect(login.body.usuario).toMatchObject({ nome: 'Usuário Integração', email });
    expect(login.body.token).toEqual(expect.any(String));
    expect(invalido).toEqual({ status: 401, body: { error: 'E-mail ou senha incorretos.' } });
    token = login.body.token;
  });

  test('rejeita moto inválida e exige autenticação', async () => {
    const semToken = await request(server, 'POST', '/api/motos', {});
    const invalida = await request(server, 'POST', '/api/motos', {
      marca: 'Honda', modelo: `${modelo}-INVALIDA`, categoria: 'Street', ano: 1800,
      cor: 'Preta', preco: 20000, quilometragem: 0, cilindradas: 160,
    }, { Authorization: `Bearer ${token}` });

    expect(semToken.status).toBe(401);
    expect(invalida).toEqual({ status: 400, body: { error: 'Dados da moto invalidos.' } });
  });

  test('cadastra, consulta, altera e exclui moto no banco real', async () => {
    const dados = {
      marca: 'Ducati', modelo, categoria: 'Naked', ano: 2024, cor: 'Vermelha',
      preco: 59900, quilometragem: 1200, cilindradas: 803, imagem: '', descricao: '', destaque: false,
    };
    const auth = { Authorization: `Bearer ${token}` };
    const cadastro = await request(server, 'POST', '/api/motos', dados, auth);
    const duplicada = await request(server, 'POST', '/api/motos', dados, auth);
    const listagem = await request(server, 'GET', `/api/motos?busca=${encodeURIComponent(modelo)}`);
    const outroEmail = `teste.integracao.outro.${execucao}@motoprime.com`;
    await request(server, 'POST', '/api/usuarios', { nome: 'Outro usuario', email: outroEmail, senha: '123456' });
    const outroLogin = await request(server, 'POST', '/api/login', { email: outroEmail, senha: '123456' });
    const authOutroUsuario = { Authorization: `Bearer ${outroLogin.body.token}` };
    const alteracaoNegada = await request(server, 'PUT', `/api/motos/${cadastro.body.id}`, { ...dados, cor: 'Preta' }, authOutroUsuario);
    const exclusaoNegada = await request(server, 'DELETE', `/api/motos/${cadastro.body.id}`, null, authOutroUsuario);
    const alteracao = await request(server, 'PUT', `/api/motos/${cadastro.body.id}`, { ...dados, cor: 'Azul' }, auth);
    const exclusao = await request(server, 'DELETE', `/api/motos/${cadastro.body.id}`, null, auth);
    const removida = await prisma.moto.findUnique({ where: { id: cadastro.body.id } });

    expect(cadastro.status).toBe(201);
    expect(duplicada).toEqual({ status: 409, body: { error: 'Moto ja cadastrada.' } });
    expect(listagem.body).toHaveLength(1);
    expect(alteracaoNegada).toEqual({ status: 403, body: { error: 'Somente o criador pode editar esta moto.' } });
    expect(exclusaoNegada).toEqual({ status: 403, body: { error: 'Somente o criador pode excluir esta moto.' } });
    expect(alteracao.body.cor).toBe('Azul');
    expect(exclusao.status).toBe(204);
    expect(removida).toBeNull();
  });
});
