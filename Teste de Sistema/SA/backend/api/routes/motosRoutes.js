import { Router } from 'express';
import {
  autenticarUsuario,
  buscarUsuarioPorEmail,
  cadastrarUsuario,
  listarMotos,
} from '../services/motoService.js';

export const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha sao obrigatorios.' });
  }

  try {
    const usuario = await autenticarUsuario(email, senha);

    if (usuario) {
      return res.status(200).json({
        message: 'Login realizado!',
        token: 'token',
        usuario,
      });
    }

    res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;
  const nomeTratado = typeof nome === 'string' ? nome.trim() : '';
  const emailTratado = typeof email === 'string' ? email.trim() : '';

  if (!nomeTratado || !emailTratado || !senha) {
    return res.status(400).json({ error: 'Nome, e-mail e senha sao obrigatorios.' });
  }

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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuario' });
  }
});

router.get('/motos', async (req, res) => {
  const { busca } = req.query;

  try {
    const motos = await listarMotos(busca);
    res.json(motos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar motos' });
  }
});
