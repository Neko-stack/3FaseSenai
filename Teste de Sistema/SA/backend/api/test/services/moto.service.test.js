import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const atualizarMotoPorIdECriador = jest.fn();
const buscarMotoPorIdRepository = jest.fn();
const criarMotoRepository = jest.fn();
const excluirMotoPorIdECriador = jest.fn();
const listarMotosPorTermo = jest.fn();

jest.unstable_mockModule('../../src/repositories/moto.repository.js', () => ({
  atualizarMotoPorIdECriador,
  buscarMotoPorId: buscarMotoPorIdRepository,
  criarMoto: criarMotoRepository,
  excluirMotoPorIdECriador,
  listarMotosPorTermo,
}));

const {
  atualizarMoto,
  buscarMotoPorId,
  cadastrarMoto,
  excluirMoto,
  listarMotos,
} = await import('../../src/services/moto.service.js');

describe('moto.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listarMotos consulta repository por termo', async () => {
    listarMotosPorTermo.mockResolvedValue([]);

    await listarMotos('honda');

    expect(listarMotosPorTermo).toHaveBeenCalledWith('honda');
  });

  test('buscarMotoPorId consulta repository por id', async () => {
    buscarMotoPorIdRepository.mockResolvedValue({ id: 1 });

    await buscarMotoPorId(1);

    expect(buscarMotoPorIdRepository).toHaveBeenCalledWith(1);
  });

  test('cadastrarMoto cria moto com criador', async () => {
    const dados = { modelo: 'CB 500F' };
    criarMotoRepository.mockResolvedValue({ id: 1, ...dados });

    await cadastrarMoto(dados, 7);

    expect(criarMotoRepository).toHaveBeenCalledWith(dados, 7);
  });

  test('atualizarMoto atualiza por id e criador', async () => {
    const dados = { cor: 'Azul' };
    atualizarMotoPorIdECriador.mockResolvedValue({ id: 1, ...dados });

    await atualizarMoto(1, dados, 7);

    expect(atualizarMotoPorIdECriador).toHaveBeenCalledWith(1, dados, 7);
  });

  test('excluirMoto exclui por id e criador', async () => {
    excluirMotoPorIdECriador.mockResolvedValue({});

    await excluirMoto(1, 7);

    expect(excluirMotoPorIdECriador).toHaveBeenCalledWith(1, 7);
  });
});
