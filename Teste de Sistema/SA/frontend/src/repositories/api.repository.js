const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_CHAVE = 'token-motos';

export function salvarToken(token) {
  window.localStorage.setItem(TOKEN_CHAVE, token);
}

export function removerToken() {
  window.localStorage.removeItem(TOKEN_CHAVE);
}

export async function requisicao(caminho, opcoes = {}) {
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
