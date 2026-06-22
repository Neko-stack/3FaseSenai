import { readFileSync } from 'fs';

test('schema.prisma define os modelos principais da API', () => {
  const schema = readFileSync(new URL('../prisma/schema.prisma', import.meta.url), 'utf8');

  expect(schema).toContain('model Usuario');
  expect(schema).toContain('model Moto');
  expect(schema).toContain('@@map("usuarios")');
  expect(schema).toContain('@@map("motos")');
});
