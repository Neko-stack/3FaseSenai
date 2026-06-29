import { motos as motosLocais } from '../motos.js';

const imagensPorModelo = new Map(motosLocais.map((moto) => [moto.nome, moto.imagem]));
const categoriasPorMarca = {
  BMW: 'Adventure',
  Honda: 'Street',
  Kawasaki: 'Sport',
  Yamaha: 'Naked',
};

export function normalizarMoto(moto) {
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
