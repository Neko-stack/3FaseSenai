import express from 'express';
import { auth } from './middleware/auth';
import cors from "cors"
import { authRouter } from './routes/auth';
import { usuarioRouter } from './routes/usuario';
import { exameRouter } from './routes/exame';

const app = express();
app.use(express.json())
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",")
app.use(cors({ origin: allowedOrigins }))
const port = 3000;

app.get('/', (req, res) => {
  res.send("Hello world")
})

app.use(authRouter)

//midleware de autenticação
app.use(auth)

app.use(usuarioRouter)
app.use(exameRouter)

app.listen(port, () => {
  console.log("Servidor ta de pé :p")
})