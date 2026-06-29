import { removerToken, requisicao, salvarToken } from '../repositories/api.repository.js';
import { normalizarMoto } from '../services/moto.service.js';

export async function buscarMotosDaApi() {
  const motos = await requisicao('/api/motos');
  return motos.map(normalizarMoto);
}

export async function loginNaApi(email, senha) {
  const data = await requisicao('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
  salvarToken(data.token);
  return data.usuario;
}

export async function cadastrarUsuarioNaApi({ nome, email, senha }) {
  const data = await requisicao('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha }),
  });
  return data.usuario;
}

export async function buscarUsuariosDaApi(busca = '') {
  const params = busca.trim() ? `?busca=${encodeURIComponent(busca.trim())}` : '';
  return requisicao(`/api/usuarios${params}`);
}

export function sairDaApi() {
  removerToken();
}

export async function atualizarUsuarioNaApi(dados) {
  const resposta = await requisicao('/api/usuarios/me', {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
  return resposta.usuario;
}

export async function cadastrarMotoNaApi(dados) {
  return normalizarMoto(await requisicao('/api/motos', {
    method: 'POST',
    body: JSON.stringify(dados),
  }));
}

export async function atualizarMotoNaApi(id, dados) {
  return normalizarMoto(await requisicao(`/api/motos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  }));
}

export async function excluirMotoNaApi(id) {
  return requisicao(`/api/motos/${id}`, { method: 'DELETE' });
}
