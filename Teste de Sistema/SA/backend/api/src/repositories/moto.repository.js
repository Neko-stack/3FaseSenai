import { prisma } from '../config/db.js';

export function listarMotosPorTermo(busca) {
  return prisma.moto.findMany({
    where: busca
      ? {
          OR: [
            { modelo: { contains: busca, mode: 'insensitive' } },
            { marca: { contains: busca, mode: 'insensitive' } },
          ],
        }
      : undefined,
  });
}

export function buscarMotoPorId(id) {
  return prisma.moto.findUnique({
    where: { id: Number(id) },
  });
}

export function criarMoto(dados, criadorId) {
  return prisma.moto.create({ data: { ...dados, criadorId } });
}

export function atualizarMotoPorIdECriador(id, dados, criadorId) {
  return prisma.moto.update({
    where: { id: Number(id), criadorId },
    data: dados,
  });
}

export function excluirMotoPorIdECriador(id, criadorId) {
  return prisma.moto.delete({ where: { id: Number(id), criadorId } });
}
