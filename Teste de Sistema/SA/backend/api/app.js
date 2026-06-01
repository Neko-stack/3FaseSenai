import express from "express";
import cors from "cors";
import { pathToFileURL } from "url";
import { pool as db } from "./db/db.js";

export const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha sao obrigatorios.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length > 0) {
      return res.status(200).json({
        message: 'Login realizado!',
        token: 'token',
        usuario: rows[0]
      });
    }

    res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});


app.get('/api/motos', async (req, res) => {
  const { busca } = req.query;

  try {
    let query = 'SELECT * FROM motos';
    let params = [];

    if (busca) {
      query += ' WHERE modelo LIKE ? OR marca LIKE ?';
      params = [`%${busca}%`, `%${busca}%`];
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar motos' });
  }
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}
