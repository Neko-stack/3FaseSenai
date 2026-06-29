import dotenv from 'dotenv';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

export const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  authSecret: process.env.AUTH_SECRET,
};
