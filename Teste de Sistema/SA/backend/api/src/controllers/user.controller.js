import { criarToken } from '../services/auth.service.js';
import {
  autenticarUsuario,
  atualizarUsuario,
  buscarUsuarioPorEmail,
  cadastrarUsuario,
  listarUsuarios,
} from '../services/user.service.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const { senha } = req.body;

  if (!email || typeof senha !== 'string' || !senha) {
    return res.status(400).json({ error: 'E-mail e senha sao obrigatorios.' });
  }

  if (!EMAIL_REGEX.test(email)) return res.status(400).json({ error: 'E-mail invalido.' });

  try {
    const usuario = await autenticarUsuario(email, senha);

    if (usuario) {
      return res.status(200).json({
        message: 'Login realizado!',
        token: criarToken(usuario),
        usuario,
      });
    }

    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  } catch {
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}

export async function criarUsuario(req, res) {
  const { nome, email, senha } = req.body;
  const nomeTratado = typeof nome === 'string' ? nome.trim() : '';
  const emailTratado = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!nomeTratado || !emailTratado || typeof senha !== 'string' || !senha) {
    return res.status(400).json({ error: 'Nome, e-mail e senha sao obrigatorios.' });
  }

  if (!EMAIL_REGEX.test(emailTratado)) return res.status(400).json({ error: 'E-mail invalido.' });

  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    const usuarioExistente = await buscarUsuarioPorEmail(emailTratado);

    if (usuarioExistente) {
      return res.status(409).json({ error: 'Este e-mail ja esta cadastrado.' });
    }

    const usuario = await cadastrarUsuario({
      nome: nomeTratado,
      email: emailTratado,
      senha,
    });

    return res.status(201).json({
      message: 'Usuario cadastrado!',
      usuario,
    });
  } catch {
    return res.status(500).json({ error: 'Erro ao cadastrar usuario' });
  }
}

export async function consultarUsuarios(req, res) {
  try {
    const usuarios = await listarUsuarios(req.query.busca);
    return res.json(usuarios);
  } catch {
    return res.status(500).json({ error: 'Erro ao buscar usuarios.' });
  }
}

export async function atualizarPerfil(req, res) {
  const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const telefone = typeof req.body.telefone === 'string' ? req.body.telefone.trim() : '';

  if (!nome || !email) return res.status(400).json({ error: 'Nome e e-mail sao obrigatorios.' });
  if (!EMAIL_REGEX.test(email)) return res.status(400).json({ error: 'E-mail invalido.' });

  try {
    const existente = await buscarUsuarioPorEmail(email);
    if (existente && existente.id !== req.usuarioId) {
      return res.status(409).json({ error: 'Este e-mail ja esta cadastrado.' });
    }

    const usuario = await atualizarUsuario(req.usuarioId, { nome, email, telefone });
    return res.json({ message: 'Usuario atualizado!', usuario });
  } catch {
    return res.status(500).json({ error: 'Erro ao atualizar usuario.' });
  }
}
