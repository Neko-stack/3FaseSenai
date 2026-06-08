import { jest } from '@jest/globals';

const executeMock = jest.fn();

jest.unstable_mockModule('../db/db.js', () => ({
  pool: {
    execute: executeMock,
  },
}));

const { listarMotos, buscarMotoPorId, autenticarUsuario } = await import('../services/motoService.js');

describe('motoService', () => {
  beforeEach(() => {
    executeMock.mockReset();
  });

  describe('listarMotos', () => {
    test('retorna todas as motos quando não há filtro', async () => {
      const motos = [
        { id: 1, marca: 'Honda', modelo: 'CB 500F' },
        { id: 2, marca: 'Yamaha', modelo: 'MT-03' },
      ];
      executeMock.mockResolvedValueOnce([motos]);

      const resultado = await listarMotos();

      expect(executeMock).toHaveBeenCalledWith('SELECT * FROM motos', []);
      expect(resultado).toEqual(motos);
    });

    test('filtra motos por modelo ou marca quando busca é fornecida', async () => {
      const motos = [{ id: 4, marca: 'Kawasaki', modelo: 'Ninja 400' }];
      executeMock.mockResolvedValueOnce([motos]);

      const resultado = await listarMotos('ninja');

      expect(executeMock).toHaveBeenCalledWith(
        'SELECT * FROM motos WHERE modelo LIKE ? OR marca LIKE ?',
        ['%ninja%', '%ninja%']
      );
      expect(resultado).toEqual(motos);
    });

    test('retorna array vazio quando nenhuma moto é encontrada', async () => {
      executeMock.mockResolvedValueOnce([[]]);

      const resultado = await listarMotos('inexistente');

      expect(resultado).toEqual([]);
    });

    test('propaga erro quando o banco falha', async () => {
      executeMock.mockRejectedValueOnce(new Error('connection lost'));

      await expect(listarMotos()).rejects.toThrow('connection lost');
    });
  });

  describe('buscarMotoPorId', () => {
    test('retorna moto quando id existe', async () => {
      const moto = { id: 1, marca: 'Honda', modelo: 'CB 500F' };
      executeMock.mockResolvedValueOnce([[moto]]);

      const resultado = await buscarMotoPorId(1);

      expect(executeMock).toHaveBeenCalledWith('SELECT * FROM motos WHERE id = ?', [1]);
      expect(resultado).toEqual(moto);
    });

    test('retorna null quando id não existe', async () => {
      executeMock.mockResolvedValueOnce([[]]);

      const resultado = await buscarMotoPorId(999);

      expect(resultado).toBeNull();
    });
  });

  describe('autenticarUsuario', () => {
    test('retorna usuario quando credenciais são válidas', async () => {
      const usuario = { id: 1, nome: 'Administrador', email: 'admin@motoprime.com' };
      executeMock.mockResolvedValueOnce([[usuario]]);

      const resultado = await autenticarUsuario('admin@motoprime.com', '123456');

      expect(executeMock).toHaveBeenCalledWith(
        'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
        ['admin@motoprime.com', '123456']
      );
      expect(resultado).toEqual(usuario);
    });

    test('retorna null quando credenciais são inválidas', async () => {
      executeMock.mockResolvedValueOnce([[]]);

      const resultado = await autenticarUsuario('erro@motoprime.com', 'errada');

      expect(resultado).toBeNull();
    });

    test('propaga erro quando o banco falha', async () => {
      executeMock.mockRejectedValueOnce(new Error('database offline'));

      await expect(autenticarUsuario('admin@motoprime.com', '123456')).rejects.toThrow('database offline');
    });
  });
});
