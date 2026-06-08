import { describe, test, expect } from 'vitest';
import { motos, categorias } from '../../src/motos.js';

describe('motos', () => {
  test('exporta array com 4 motos', () => {
    expect(motos).toHaveLength(4);
  });

  test('cada moto possui os campos obrigatórios', () => {
    const camposObrigatorios = ['id', 'nome', 'categoria', 'preco', 'ano', 'km', 'cilindradas', 'cor', 'destaque', 'imagem'];

    for (const moto of motos) {
      for (const campo of camposObrigatorios) {
        expect(moto).toHaveProperty(campo);
      }
    }
  });

  test('todas as motos possuem preco numerico positivo', () => {
    for (const moto of motos) {
      expect(typeof moto.preco).toBe('number');
      expect(moto.preco).toBeGreaterThan(0);
    }
  });

  test('todas as motos possuem ano válido', () => {
    for (const moto of motos) {
      expect(moto.ano).toBeGreaterThanOrEqual(2020);
      expect(moto.ano).toBeLessThanOrEqual(2030);
    }
  });

  test('ids são únicos', () => {
    const ids = motos.map((moto) => moto.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('imagens possuem URLs válidas', () => {
    for (const moto of motos) {
      expect(moto.imagem).toMatch(/^https?:\/\//);
    }
  });
});

describe('categorias', () => {
  test('primeiro item é "Todas"', () => {
    expect(categorias[0]).toBe('Todas');
  });

  test('contém categorias únicas derivadas das motos', () => {
    const categoriasEsperadas = [...new Set(motos.map((m) => m.categoria))];

    for (const cat of categoriasEsperadas) {
      expect(categorias).toContain(cat);
    }
  });

  test('não contém categorias duplicadas', () => {
    expect(new Set(categorias).size).toBe(categorias.length);
  });

  test('contém as categorias Street, Naked, Adventure e Sport', () => {
    expect(categorias).toContain('Street');
    expect(categorias).toContain('Naked');
    expect(categorias).toContain('Adventure');
    expect(categorias).toContain('Sport');
  });
});
