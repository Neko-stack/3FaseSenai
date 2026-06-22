import { prisma } from '../../backend/api/db/db.js';

export default async function globalTeardown() {
  await prisma.moto.deleteMany({ where: { modelo: { startsWith: 'E2E-' } } });
  await prisma.usuario.deleteMany({ where: { email: { startsWith: 'teste.e2e.' } } });
  await prisma.$disconnect();
}
