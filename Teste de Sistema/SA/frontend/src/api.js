import { motos as motosLocais } from './motos.js';

const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_CHAVE = 'token-motos';

async function requisicao(caminho, opcoes = {}) {
  const token = window.localStorage.getItem(TOKEN_CHAVE);
  const response = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Erro ao acessar o servidor');
  return data;
}

const imagensPorModelo = new Map(motosLocais.map((moto) => [moto.nome, moto.imagem]));
const categoriasPorMarca = {
  BMW: 'Adventure',
  Honda: 'Street',
  Kawasaki: 'Sport',
  Yamaha: 'Naked',
};

function normalizarMoto(moto) {
  const nome = moto.nome || `${moto.marca} ${moto.modelo}`;

  return {
    id: moto.id,
    nome,
    categoria: moto.categoria || categoriasPorMarca[moto.marca] || 'Street',
    preco: Number(moto.preco),
    ano: moto.ano,
    km: moto.km ?? moto.quilometragem ?? 0,
    cilindradas: moto.cilindradas || 0,
    cor: moto.cor || 'Nao informada',
    destaque: Boolean(moto.destaque),
    imagem: moto.imagem || imagensPorModelo.get(nome) || motosLocais[0].imagem,
    marca: moto.marca,
    modelo: moto.modelo,
    descricao: moto.descricao || '',
    criadorId: moto.criadorId,
  };
}

export async function buscarMotosDaApi() {
  const motos = await requisicao('/api/motos');
  return motos.map(normalizarMoto);
}

export async function loginNaApi(email, senha) {
  const data = await requisicao('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
  window.localStorage.setItem(TOKEN_CHAVE, data.token);
  return data.usuario;
}

export async function cadastrarUsuarioNaApi({ nome, email, senha }) {
  const data = await requisicao('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha }),
  });
  return data.usuario;
}

export function sairDaApi() {
  window.localStorage.removeItem(TOKEN_CHAVE);
}

export async function atualizarUsuarioNaApi(dados) {
  const resposta = await requisicao('/api/usuarios/me', { method: 'PUT', body: JSON.stringify(dados) });
  return resposta.usuario;
}

export async function cadastrarMotoNaApi(dados) {
  return normalizarMoto(await requisicao('/api/motos', { method: 'POST', body: JSON.stringify(dados) }));
}

export async function atualizarMotoNaApi(id, dados) {
  return normalizarMoto(await requisicao(`/api/motos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }));
}

export async function excluirMotoNaApi(id) {
  return requisicao(`/api/motos/${id}`, { method: 'DELETE' });
}
