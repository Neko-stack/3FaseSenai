import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const atualizarUsuarioPorId = jest.fn();
const buscarUsuarioComSenhaPorEmail = jest.fn();
const buscarUsuarioPorEmailRepository = jest.fn();
const criarUsuarioRepository = jest.fn();
const listarUsuariosPorTermo = jest.fn();

jest.unstable_mockModule('../../src/repositories/user.repository.js', () => ({
  atualizarUsuarioPorId,
  buscarUsuarioComSenhaPorEmail,
  buscarUsuarioPorEmail: buscarUsuarioPorEmailRepository,
  criarUsuario: criarUsuarioRepository,
  listarUsuariosPorTermo,
}));

const {
  autenticarUsuario,
  atualizarUsuario,
  buscarUsuarioPorEmail,
  cadastrarUsuario,
  listarUsuarios,
} = await import('../../src/services/user.service.js');

describe('user.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('cadastrarUsuario salva senha com hash', async () => {
    criarUsuarioRepository.mockImplementation((dados) => Promise.resolve({ id: 1, ...dados }));

    const usuario = await cadastrarUsuario({ nome: 'Ana', email: 'ana@email.com', senha: '123456' });

    expect(usuario.senha).toMatch(/^scrypt\$/);
    expect(usuario.senha).not.toBe('123456');
    expect(criarUsuarioRepository).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'Ana',
      email: 'ana@email.com',
    }));
  });

  test('autenticarUsuario retorna usuario sem senha quando senha confere', async () => {
    criarUsuarioRepository.mockImplementation((dados) => Promise.resolve({ id: 1, ...dados }));
    const salvo = await cadastrarUsuario({ nome: 'Ana', email: 'ana@email.com', senha: '123456' });
    buscarUsuarioComSenhaPorEmail.mockResolvedValue(salvo);

    const usuario = await autenticarUsuario('ana@email.com', '123456');

    expect(usuario).toEqual({ id: 1, nome: 'Ana', email: 'ana@email.com' });
  });

  test('autenticarUsuario retorna null quando senha nao confere', async () => {
    buscarUsuarioComSenhaPorEmail.mockResolvedValue({
      id: 1,
      nome: 'Ana',
      email: 'ana@email.com',
      senha: 'scrypt$salt$hash',
    });

    await expect(autenticarUsuario('ana@email.com', 'errada')).resolves.toBeNull();
  });

  test('listarUsuarios limpa termo de busca', async () => {
    listarUsuariosPorTermo.mockResolvedValue([]);

    await listarUsuarios('  ana  ');

    expect(listarUsuariosPorTermo).toHaveBeenCalledWith('ana');
  });

  test('buscarUsuarioPorEmail repassa email ao repository', async () => {
    buscarUsuarioPorEmailRepository.mockResolvedValue({ id: 1 });

    await buscarUsuarioPorEmail('ana@email.com');

    expect(buscarUsuarioPorEmailRepository).toHaveBeenCalledWith('ana@email.com');
  });

  test('atualizarUsuario repassa dados ao repository', async () => {
    atualizarUsuarioPorId.mockResolvedValue({ id: 1 });

    await atualizarUsuario(1, { nome: 'Ana', email: 'ana@email.com', telefone: '11' });

    expect(atualizarUsuarioPorId).toHaveBeenCalledWith(1, {
      nome: 'Ana',
      email: 'ana@email.com',
      telefone: '11',
    });
  });
});
