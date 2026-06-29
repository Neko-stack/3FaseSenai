import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const atualizarMoto = jest.fn();
const cadastrarMoto = jest.fn();
const excluirMoto = jest.fn();
const listarMotos = jest.fn();

jest.unstable_mockModule('../../src/services/moto.service.js', () => ({
  atualizarMoto,
  cadastrarMoto,
  excluirMoto,
  listarMotos,
}));

const {
  alterarMoto,
  consultarMotos,
  criarMoto,
  removerMoto,
} = await import('../../src/controllers/moto.controller.js');

function resposta() {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res),
  };
  return res;
}

const dadosValidos = {
  marca: 'Honda',
  modelo: 'CB 500F',
  categoria: 'Street',
  ano: 2024,
  cor: 'Vermelha',
  preco: 42000,
  quilometragem: 1000,
  cilindradas: 500,
};

describe('moto.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('consultarMotos retorna lista do service', async () => {
    const motos = [{ id: 1, modelo: 'CB 500F' }];
    listarMotos.mockResolvedValue(motos);
    const res = resposta();

    await consultarMotos({ query: { busca: 'cb' } }, res);

    expect(listarMotos).toHaveBeenCalledWith('cb');
    expect(res.json).toHaveBeenCalledWith(motos);
  });

  test('criarMoto valida dados obrigatorios', async () => {
    const res = resposta();

    await criarMoto({ body: { ...dadosValidos, ano: 1800 }, usuarioId: 1 }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(cadastrarMoto).not.toHaveBeenCalled();
  });

  test('criarMoto retorna 201 com dados validos', async () => {
    const moto = { id: 1, ...dadosValidos };
    cadastrarMoto.mockResolvedValue(moto);
    const res = resposta();

    await criarMoto({ body: dadosValidos, usuarioId: 7 }, res);

    expect(cadastrarMoto).toHaveBeenCalledWith(expect.objectContaining({ modelo: 'CB 500F' }), 7);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(moto);
  });

  test('alterarMoto rejeita id invalido', async () => {
    const res = resposta();

    await alterarMoto({ params: { id: 'abc' }, body: dadosValidos, usuarioId: 1 }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(atualizarMoto).not.toHaveBeenCalled();
  });

  test('removerMoto retorna 204 quando exclui', async () => {
    excluirMoto.mockResolvedValue({});
    const res = resposta();

    await removerMoto({ params: { id: '10' }, usuarioId: 3 }, res);

    expect(excluirMoto).toHaveBeenCalledWith('10', 3);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });
});
