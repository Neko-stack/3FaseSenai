import {
  atualizarMoto,
  cadastrarMoto,
  excluirMoto,
  listarMotos,
} from '../services/moto.service.js';

export async function consultarMotos(req, res) {
  const { busca } = req.query;

  try {
    const motos = await listarMotos(busca);
    return res.json(motos);
  } catch {
    return res.status(500).json({ error: 'Erro ao buscar motos' });
  }
}

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

export async function criarMoto(req, res) {
  const dados = dadosMoto(req.body);
  if (!dados) return res.status(400).json({ error: 'Dados da moto invalidos.' });

  try {
    return res.status(201).json(await cadastrarMoto(dados, req.usuarioId));
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Moto ja cadastrada.' });
    return res.status(500).json({ error: 'Erro ao cadastrar moto.' });
  }
}

export async function alterarMoto(req, res) {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Id da moto invalido.' });
  const dados = dadosMoto(req.body);
  if (!dados) return res.status(400).json({ error: 'Dados da moto invalidos.' });

  try {
    return res.json(await atualizarMoto(req.params.id, dados, req.usuarioId));
  } catch (error) {
    if (error.code === 'P2025') return res.status(403).json({ error: 'Somente o criador pode editar esta moto.' });
    if (error.code === 'P2002') return res.status(409).json({ error: 'Moto ja cadastrada.' });
    return res.status(500).json({ error: 'Erro ao atualizar moto.' });
  }
}

export async function removerMoto(req, res) {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Id da moto invalido.' });

  try {
    await excluirMoto(req.params.id, req.usuarioId);
    return res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') return res.status(403).json({ error: 'Somente o criador pode excluir esta moto.' });
    return res.status(500).json({ error: 'Erro ao excluir moto.' });
  }
}
