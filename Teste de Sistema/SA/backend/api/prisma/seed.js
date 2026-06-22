import { PrismaClient } from '@prisma/client';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

async function hash(senha) {
  const salt = randomBytes(16).toString('hex');
  const valor = await scryptAsync(senha, salt, 64);
  return `scrypt$${salt}$${valor.toString('hex')}`;
}

await prisma.usuario.upsert({
  where: { email: 'admin@motoprime.com' },
  update: {},
  create: { nome: 'Administrador', email: 'admin@motoprime.com', senha: await hash('123456') },
});

const motos = [
  { marca: 'Honda', modelo: 'CB 500F', categoria: 'Street', ano: 2024, cor: 'Vermelha', preco: 41000, quilometragem: 0, cilindradas: 471, destaque: true },
  { marca: 'Yamaha', modelo: 'MT-03', categoria: 'Naked', ano: 2024, cor: 'Azul', preco: 33000, quilometragem: 0, cilindradas: 321, destaque: false },
];

for (const moto of motos) {
  await prisma.moto.upsert({
    where: { marca_modelo: { marca: moto.marca, modelo: moto.modelo } },
    update: {},
    create: moto,
  });
}

await prisma.$disconnect();
