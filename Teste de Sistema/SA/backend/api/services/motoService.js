import { pool as db } from '../db/db.js';

export async function listarMotos(busca) {
  let query = 'SELECT * FROM motos';
  let params = [];

  if (busca) {
    query += ' WHERE modelo LIKE ? OR marca LIKE ?';
    params = [`%${busca}%`, `%${busca}%`];
  }

  const [rows] = await db.execute(query, params);
  return rows;
}

export async function buscarMotoPorId(id) {
  const [rows] = await db.execute('SELECT * FROM motos WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function autenticarUsuario(email, senha) {
  const [rows] = await db.execute(
    'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha]
  );

  return rows.length > 0 ? rows[0] : null;
}

export async function buscarUsuarioPorEmail(email) {
  const [rows] = await db.execute('SELECT id, nome, email FROM usuarios WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
}

export async function cadastrarUsuario({ nome, email, senha }) {
  const [resultado] = await db.execute(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha]
  );

  return {
    id: resultado.insertId,
    nome,
    email,
  };
}
