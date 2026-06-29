import { env } from './env.js';

export function iniciarServidor(app) {
  return app.listen(env.port, () => {
    console.log(`Servidor rodando em http://localhost:${env.port}`);
  });
}
