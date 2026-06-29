import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import {
  atualizarUsuarioPorId,
  buscarUsuarioComSenhaPorEmail,
  buscarUsuarioPorEmail as buscarUsuarioPorEmailRepository,
  criarUsuario,
  listarUsuariosPorTermo,
} from '../repositories/user.repository.js';

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

export async function autenticarUsuario(email, senha) {
  const usuario = await buscarUsuarioComSenhaPorEmail(email);

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
  return buscarUsuarioPorEmailRepository(email);
}

export async function listarUsuarios(busca) {
  const termo = typeof busca === 'string' ? busca.trim() : '';

  return listarUsuariosPorTermo(termo);
}

export async function cadastrarUsuario({ nome, email, senha }) {
  const senhaHash = await criarHashSenha(senha);

  return criarUsuario({ nome, email, senha: senhaHash });
}

export async function atualizarUsuario(id, { nome, email, telefone }) {
  return atualizarUsuarioPorId(id, { nome, email, telefone });
}
