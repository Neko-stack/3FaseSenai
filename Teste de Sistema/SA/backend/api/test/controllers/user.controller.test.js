import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const autenticarUsuario = jest.fn();
const atualizarUsuario = jest.fn();
const buscarUsuarioPorEmail = jest.fn();
const cadastrarUsuario = jest.fn();
const listarUsuarios = jest.fn();
const criarToken = jest.fn(() => 'token-teste');

jest.unstable_mockModule('../../src/services/user.service.js', () => ({
  autenticarUsuario,
  atualizarUsuario,
  buscarUsuarioPorEmail,
  cadastrarUsuario,
  listarUsuarios,
}));

jest.unstable_mockModule('../../src/services/auth.service.js', () => ({
  criarToken,
}));

const {
  atualizarPerfil,
  consultarUsuarios,
  criarUsuario,
  login,
} = await import('../../src/controllers/user.controller.js');

function resposta() {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  return res;
}

describe('user.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login retorna token quando credenciais sao validas', async () => {
    const usuario = { id: 1, nome: 'Admin', email: 'admin@motoprime.com' };
    autenticarUsuario.mockResolvedValue(usuario);
    const res = resposta();

    await login({ body: { email: ' ADMIN@MOTOPRIME.COM ', senha: '123456' } }, res);

    expect(autenticarUsuario).toHaveBeenCalledWith('admin@motoprime.com', '123456');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login realizado!',
      token: 'token-teste',
      usuario,
    });
  });

  test('login invalido retorna 401', async () => {
    autenticarUsuario.mockResolvedValue(null);
    const res = resposta();

    await login({ body: { email: 'admin@motoprime.com', senha: 'errada' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'E-mail ou senha incorretos.' });
  });

  test('criarUsuario rejeita senha curta', async () => {
    const res = resposta();

    await criarUsuario({ body: { nome: 'Ana', email: 'ana@email.com', senha: '123' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(cadastrarUsuario).not.toHaveBeenCalled();
  });

  test('criarUsuario cadastra usuario novo', async () => {
    const usuario = { id: 2, nome: 'Ana', email: 'ana@email.com' };
    buscarUsuarioPorEmail.mockResolvedValue(null);
    cadastrarUsuario.mockResolvedValue(usuario);
    const res = resposta();

    await criarUsuario({ body: { nome: ' Ana ', email: ' ANA@EMAIL.COM ', senha: '123456' } }, res);

    expect(cadastrarUsuario).toHaveBeenCalledWith({ nome: 'Ana', email: 'ana@email.com', senha: '123456' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario cadastrado!', usuario });
  });

  test('consultarUsuarios retorna lista filtrada', async () => {
    const usuarios = [{ id: 1, nome: 'Admin' }];
    listarUsuarios.mockResolvedValue(usuarios);
    const res = resposta();

    await consultarUsuarios({ query: { busca: 'admin' } }, res);

    expect(listarUsuarios).toHaveBeenCalledWith('admin');
    expect(res.json).toHaveBeenCalledWith(usuarios);
  });

  test('atualizarPerfil rejeita email duplicado de outro usuario', async () => {
    buscarUsuarioPorEmail.mockResolvedValue({ id: 99, email: 'ana@email.com' });
    const res = resposta();

    await atualizarPerfil({
      usuarioId: 1,
      body: { nome: 'Ana', email: 'ana@email.com', telefone: '11999999999' },
    }, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(atualizarUsuario).not.toHaveBeenCalled();
  });
});
