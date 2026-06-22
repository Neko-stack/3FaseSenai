import { Router } from 'express';
import {
  autenticarUsuario,
  atualizarMoto,
  atualizarUsuario,
  buscarUsuarioPorEmail,
  cadastrarMoto,
  cadastrarUsuario,
  excluirMoto,
  listarMotos,
} from '../services/motoService.js';
import { criarToken, exigirAutenticacao } from '../services/authService.js';

export const router = Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/login', async (req, res) => {
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

    res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.post('/usuarios', async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuario' });
  }
});

router.put('/usuarios/me', exigirAutenticacao, async (req, res) => {
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

function dadosMoto(body) {
  const dados = {
    marca: typeof body.marca === 'string' ? body.marca.trim() : '',
    modelo: typeof body.modelo === 'string' ? body.modelo.trim() : '',
    categoria: typeof body.categoria === 'string' ? body.categoria.trim() : '',
    ano: Number(body.ano),
    cor: typeof body.cor === 'string' ? body.cor.trim() : '',
    preco: Number(body.preco),
    descricao: typeof body.descricao === 'string' ? body.descricao.trim() || null : null,
    quilometragem: Number(body.quilometragem ?? 0),
    cilindradas: Number(body.cilindradas),
    imagem: typeof body.imagem === 'string' ? body.imagem.trim() || null : null,
    destaque: Boolean(body.destaque),
  };
  const anoAtual = new Date().getFullYear() + 1;
  const valido = dados.marca && dados.modelo && dados.categoria && dados.cor
    && Number.isInteger(dados.ano) && dados.ano >= 1900 && dados.ano <= anoAtual
    && Number.isFinite(dados.preco) && dados.preco >= 0
    && Number.isInteger(dados.quilometragem) && dados.quilometragem >= 0
    && Number.isInteger(dados.cilindradas) && dados.cilindradas > 0;
  return valido ? dados : null;
}

router.post('/motos', exigirAutenticacao, async (req, res) => {
  const dados = dadosMoto(req.body);
  if (!dados) return res.status(400).json({ error: 'Dados da moto invalidos.' });
  try {
    return res.status(201).json(await cadastrarMoto(dados));
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Moto ja cadastrada.' });
    return res.status(500).json({ error: 'Erro ao cadastrar moto.' });
  }
});

router.put('/motos/:id', exigirAutenticacao, async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Id da moto invalido.' });
  const dados = dadosMoto(req.body);
  if (!dados) return res.status(400).json({ error: 'Dados da moto invalidos.' });
  try {
    return res.json(await atualizarMoto(req.params.id, dados));
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Moto nao encontrada.' });
    if (error.code === 'P2002') return res.status(409).json({ error: 'Moto ja cadastrada.' });
    return res.status(500).json({ error: 'Erro ao atualizar moto.' });
  }
});

router.delete('/motos/:id', exigirAutenticacao, async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Id da moto invalido.' });
  try {
    await excluirMoto(req.params.id);
    return res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Moto nao encontrada.' });
    return res.status(500).json({ error: 'Erro ao excluir moto.' });
  }
});
