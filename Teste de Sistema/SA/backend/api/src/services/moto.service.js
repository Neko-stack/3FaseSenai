import {
  atualizarMotoPorIdECriador,
  buscarMotoPorId as buscarMotoPorIdRepository,
  criarMoto,
  excluirMotoPorIdECriador,
  listarMotosPorTermo,
} from '../repositories/moto.repository.js';

export async function listarMotos(busca) {
  return listarMotosPorTermo(busca);
}

export async function buscarMotoPorId(id) {
  return buscarMotoPorIdRepository(id);
}

export async function cadastrarMoto(dados, criadorId) {
  return criarMoto(dados, criadorId);
}

export async function atualizarMoto(id, dados, criadorId) {
  return atualizarMotoPorIdECriador(id, dados, criadorId);
}

export async function excluirMoto(id, criadorId) {
  return excluirMotoPorIdECriador(id, criadorId);
}
