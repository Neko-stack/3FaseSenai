import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const prisma = {
  moto: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.unstable_mockModule('../../src/config/db.js', () => ({ prisma }));

const {
  atualizarMotoPorIdECriador,
  buscarMotoPorId,
  criarMoto,
  excluirMotoPorIdECriador,
  listarMotosPorTermo,
} = await import('../../src/repositories/moto.repository.js');

describe('moto.repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listarMotosPorTermo monta filtro por modelo e marca', async () => {
    await listarMotosPorTermo('honda');

    expect(prisma.moto.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { modelo: { contains: 'honda', mode: 'insensitive' } },
          { marca: { contains: 'honda', mode: 'insensitive' } },
        ],
      },
    });
  });

  test('listarMotosPorTermo sem busca nao aplica where', async () => {
    await listarMotosPorTermo('');

    expect(prisma.moto.findMany).toHaveBeenCalledWith({ where: undefined });
  });

  test('buscarMotoPorId converte id para numero', async () => {
    await buscarMotoPorId('10');

    expect(prisma.moto.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
  });

  test('criarMoto inclui criadorId', async () => {
    await criarMoto({ modelo: 'CB 500F' }, 7);

    expect(prisma.moto.create).toHaveBeenCalledWith({
      data: { modelo: 'CB 500F', criadorId: 7 },
    });
  });

  test('atualizarMotoPorIdECriador filtra por id e criador', async () => {
    await atualizarMotoPorIdECriador('10', { cor: 'Azul' }, 7);

    expect(prisma.moto.update).toHaveBeenCalledWith({
      where: { id: 10, criadorId: 7 },
      data: { cor: 'Azul' },
    });
  });

  test('excluirMotoPorIdECriador filtra por id e criador', async () => {
    await excluirMotoPorIdECriador('10', 7);

    expect(prisma.moto.delete).toHaveBeenCalledWith({ where: { id: 10, criadorId: 7 } });
  });
});
