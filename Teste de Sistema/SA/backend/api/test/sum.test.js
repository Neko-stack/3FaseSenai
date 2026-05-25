import { readFileSync } from 'fs';

test('database.sql cria as tabelas principais da API', () => {
  const sql = readFileSync(new URL('../database.sql', import.meta.url), 'utf8');

  expect(sql).toContain('CREATE TABLE usuarios');
  expect(sql).toContain('CREATE TABLE motos');
});
