import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { prisma } from '../db/db.js';

const scryptAsync = promisify(scrypt);
const HASH_PREFIX = 'scrypt';
const KEY_LENGTH = 64;

async function criarHashSenha(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(senha, salt, KEY_LENGTH);

  return `${HASH_PREFIX}$${salt}$${hash.toString('hex')}`;
}

async function senhaConfere(senha, senhaSalva) {
  const [prefix, salt, hashSalvo] = senhaSalva.split('$');

  if (prefix !== HASH_PREFIX || !salt || !hashSalvo) {
    return false;
  }

  const hash = await scryptAsync(senha, salt, KEY_LENGTH);
  const hashSalvoBuffer = Buffer.from(hashSalvo, 'hex');

  return hashSalvoBuffer.length === hash.length && timingSafeEqual(hashSalvoBuffer, hash);
}

export async function listarMotos(busca) {
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

export async function buscarMotoPorId(id) {
  return prisma.moto.findUnique({
    where: { id: Number(id) },
  });
}

export async function autenticarUsuario(email, senha) {
  const usuario = await prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: {
      id: true,
      nome: true,
      email: true,
      senha: true,
    },
  });

  if (!usuario || !(await senhaConfere(senha, usuario.senha))) {
    return null;
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

export async function buscarUsuarioPorEmail(email) {
  return prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });
}

export async function cadastrarUsuario({ nome, email, senha }) {
  const senhaHash = await criarHashSenha(senha);

  return prisma.usuario.create({
    data: { nome, email: email.trim().toLowerCase(), senha: senhaHash },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });
}

export async function atualizarUsuario(id, { nome, email, telefone }) {
  return prisma.usuario.update({
    where: { id },
    data: { nome, email: email.trim().toLowerCase(), telefone: telefone || null },
    select: { id: true, nome: true, email: true, telefone: true },
  });
}

export async function cadastrarMoto(dados, criadorId) {
  return prisma.moto.create({ data: { ...dados, criadorId } });
}

export async function atualizarMoto(id, dados, criadorId) {
  return prisma.moto.update({
    where: { id: Number(id), criadorId },
    data: dados,
  });
}

export async function excluirMoto(id, criadorId) {
  return prisma.moto.delete({ where: { id: Number(id), criadorId } });
}
