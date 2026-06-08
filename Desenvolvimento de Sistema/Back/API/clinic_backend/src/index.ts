import express from 'express';
import { auth } from './middleware/auth';
import cors from "cors"
import { authRouter } from './routes/auth';
import { usuarioRouter } from './routes/usuario';
import { exameRouter } from './routes/exame';

const app = express();
app.use(express.json())
app.use(cors())
const port = 3000;

app.get('/', (req, res) => {
  console.log(req)
  res.send("Hello world")
})

app.use(authRouter)

//midleware de autenticação
app.use(auth)

app.use(usuarioRouter)
app.use(exameRouter)

app.use((err: Error, _req: import("express").Request, res: import("express").Response, _next: import("express").NextFunction) => {
  console.error("[GlobalErrorHandler]", err.message);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(port, () => {
  console.log("Servidor ta de pé :p")
})