import { Router } from 'express';
import { listarMotos, autenticarUsuario } from '../services/motoService.js';

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

router.get('/motos', async (req, res) => {
  const { busca } = req.query;

  try {
    const motos = await listarMotos(busca);
    res.json(motos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar motos' });
  }
});
