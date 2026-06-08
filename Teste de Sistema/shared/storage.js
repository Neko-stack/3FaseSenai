export function lerStorage(chave, valorInicial) {
  try {
    const valor = window.localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : valorInicial;
  } catch {
    return valorInicial;
  }
}

export function salvarStorage(chave, valor) {
  window.localStorage.setItem(chave, JSON.stringify(valor));
}
