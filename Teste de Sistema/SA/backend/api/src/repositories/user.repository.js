import { prisma } from '../config/db.js';

export function buscarUsuarioComSenhaPorEmail(email) {
  return prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: {
      id: true,
      nome: true,
      email: true,
      senha: true,
    },
  });
}

export function buscarUsuarioPorEmail(email) {
  return prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });
}

export function listarUsuariosPorTermo(termo) {
  return prisma.usuario.findMany({
    where: termo
      ? {
          OR: [
            { nome: { contains: termo, mode: 'insensitive' } },
            { email: { contains: termo, mode: 'insensitive' } },
          ],
        }
      : undefined,
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      criadoEm: true,
    },
    orderBy: { nome: 'asc' },
  });
}

export function criarUsuario({ nome, email, senha }) {
  return prisma.usuario.create({
    data: { nome, email: email.trim().toLowerCase(), senha },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });
}

export function atualizarUsuarioPorId(id, { nome, email, telefone }) {
  return prisma.usuario.update({
    where: { id },
    data: { nome, email: email.trim().toLowerCase(), telefone: telefone || null },
    select: { id: true, nome: true, email: true, telefone: true },
  });
}
