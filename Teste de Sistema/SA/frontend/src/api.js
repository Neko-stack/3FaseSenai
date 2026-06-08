import { motos as motosLocais } from './motos.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  };
}

export async function buscarMotosDaApi() {
  const response = await fetch(`${API_URL}/api/motos`);

  if (!response.ok) {
    throw new Error('Erro ao buscar motos');
  }

  const motos = await response.json();
  return motos.map(normalizarMoto);
}

export async function loginNaApi(email, senha) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Erro no login (status ${response.status})`);
  }

  const data = await response.json();
  return data.usuario;
}
