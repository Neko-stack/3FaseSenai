import { createHmac, timingSafeEqual } from 'crypto';

const TOKEN_TTL_SECONDS = 60 * 60 * 8;

function segredo() {
  return process.env.AUTH_SECRET || 'desenvolvimento-moto-prime-altere-no-env';
}

function codificar(valor) {
  return Buffer.from(JSON.stringify(valor)).toString('base64url');
}

function assinatura(payload) {
  return createHmac('sha256', segredo()).update(payload).digest('base64url');
}

export function criarToken(usuario) {
  const payload = codificar({
    sub: usuario.id,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });
  return `${payload}.${assinatura(payload)}`;
}

export function validarToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, assinaturaRecebida] = token.split('.');
  const esperada = Buffer.from(assinatura(payload));
  const recebida = Buffer.from(assinaturaRecebida || '');

  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return null;

  try {
    const dados = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return dados.exp > Math.floor(Date.now() / 1000) ? dados : null;
  } catch {
    return null;
  }
}

export function exigirAutenticacao(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const dados = validarToken(token);

  if (!dados) return res.status(401).json({ error: 'Autenticacao obrigatoria.' });

  req.usuarioId = Number(dados.sub);
  return next();
}
