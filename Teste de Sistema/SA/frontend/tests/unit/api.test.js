import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock import.meta.env for the module
vi.stubEnv('VITE_API_URL', 'http://localhost:3000');

// We need to test normalizarMoto which is not exported directly,
// so we test it indirectly via buscarMotosDaApi and also test the exported functions.
const { buscarMotosDaApi, loginNaApi } = await import('../../src/api.js');

describe('buscarMotosDaApi', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('retorna motos normalizadas quando a API responde com sucesso', async () => {
    const motosApi = [
      { id: 1, marca: 'Honda', modelo: 'CB 500F', preco: '39900', ano: 2025, quilometragem: 0, cilindradas: 471, cor: 'Vermelha', destaque: true },
      { id: 2, marca: 'Yamaha', modelo: 'MT-03', preco: 32990, ano: 2024, km: 1800, cilindradas: 321, cor: 'Cinza', destaque: false },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => motosApi,
    });

    const resultado = await buscarMotosDaApi();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/motos');
    expect(resultado).toHaveLength(2);

    // Verifica normalização da primeira moto
    expect(resultado[0]).toMatchObject({
      id: 1,
      nome: 'Honda CB 500F',
      categoria: 'Street',
      preco: 39900,
      ano: 2025,
      km: 0,
      cilindradas: 471,
      cor: 'Vermelha',
      destaque: true,
    });

    // Verifica normalização da segunda moto
    expect(resultado[1]).toMatchObject({
      id: 2,
      nome: 'Yamaha MT-03',
      categoria: 'Naked',
      preco: 32990,
      ano: 2024,
      km: 1800,
      cilindradas: 321,
      cor: 'Cinza',
      destaque: false,
    });
  });

  test('lança erro quando a resposta não é ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(buscarMotosDaApi()).rejects.toThrow('Erro ao buscar motos');
  });

  test('normaliza moto com campos faltantes usando valores padrão', async () => {
    const motosApi = [
      { id: 10, marca: 'BMW', modelo: 'G 310 GS', preco: '42990', ano: 2025 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => motosApi,
    });

    const resultado = await buscarMotosDaApi();

    expect(resultado[0]).toMatchObject({
      id: 10,
      nome: 'BMW G 310 GS',
      categoria: 'Adventure',
      preco: 42990,
      km: 0,
      cilindradas: 0,
      cor: 'Nao informada',
      destaque: false,
    });
  });

  test('usa nome existente se moto já possui campo nome', async () => {
    const motosApi = [
      { id: 5, nome: 'Custom Bike', marca: 'Ducati', modelo: 'Monster', preco: 55000, ano: 2024 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => motosApi,
    });

    const resultado = await buscarMotosDaApi();

    expect(resultado[0].nome).toBe('Custom Bike');
  });

  test('atribui categoria Street quando marca não está mapeada', async () => {
    const motosApi = [
      { id: 6, marca: 'Ducati', modelo: 'Monster', preco: 55000, ano: 2024 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => motosApi,
    });

    const resultado = await buscarMotosDaApi();

    expect(resultado[0].categoria).toBe('Street');
  });
});

describe('loginNaApi', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('retorna usuario quando login é bem-sucedido', async () => {
    const usuario = { id: 1, nome: 'Administrador', email: 'admin@motoprime.com' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login realizado!', token: 'token', usuario }),
    });

    const resultado = await loginNaApi('admin@motoprime.com', '123456');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@motoprime.com', senha: '123456' }),
    });
    expect(resultado).toEqual(usuario);
  });

  test('retorna null quando credenciais são inválidas', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const resultado = await loginNaApi('erro@motoprime.com', 'errada');

    expect(resultado).toBeNull();
  });

  test('retorna null quando servidor retorna 500', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const resultado = await loginNaApi('admin@motoprime.com', '123456');

    expect(resultado).toBeNull();
  });
});
