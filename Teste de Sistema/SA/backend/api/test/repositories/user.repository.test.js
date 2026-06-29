import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const prisma = {
  usuario: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

jest.unstable_mockModule('../../src/config/db.js', () => ({ prisma }));

const {
  atualizarUsuarioPorId,
  buscarUsuarioComSenhaPorEmail,
  buscarUsuarioPorEmail,
  criarUsuario,
  listarUsuariosPorTermo,
} = await import('../../src/repositories/user.repository.js');

describe('user.repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('buscarUsuarioComSenhaPorEmail normaliza email', async () => {
    await buscarUsuarioComSenhaPorEmail(' ADMIN@EMAIL.COM ');

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@email.com' },
      select: { id: true, nome: true, email: true, senha: true },
    });
  });

  test('buscarUsuarioPorEmail nao seleciona senha', async () => {
    await buscarUsuarioPorEmail('ana@email.com');

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: 'ana@email.com' },
      select: { id: true, nome: true, email: true },
    });
  });

  test('listarUsuariosPorTermo monta filtro por nome e email', async () => {
    await listarUsuariosPorTermo('ana');

    expect(prisma.usuario.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        OR: [
          { nome: { contains: 'ana', mode: 'insensitive' } },
          { email: { contains: 'ana', mode: 'insensitive' } },
        ],
      },
      orderBy: { nome: 'asc' },
    }));
  });

  test('criarUsuario normaliza email e seleciona retorno seguro', async () => {
    await criarUsuario({ nome: 'Ana', email: ' ANA@EMAIL.COM ', senha: 'hash' });

    expect(prisma.usuario.create).toHaveBeenCalledWith({
      data: { nome: 'Ana', email: 'ana@email.com', senha: 'hash' },
      select: { id: true, nome: true, email: true },
    });
  });

  test('atualizarUsuarioPorId grava telefone nulo quando vazio', async () => {
    await atualizarUsuarioPorId(1, { nome: 'Ana', email: 'ANA@EMAIL.COM', telefone: '' });

    expect(prisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Ana', email: 'ana@email.com', telefone: null },
      select: { id: true, nome: true, email: true, telefone: true },
    });
  });
});
