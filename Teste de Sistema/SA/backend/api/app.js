import express from "express";
import cors from "cors";
import { pathToFileURL } from "url";
import { iniciarServidor } from "./src/config/server.js";
import { motoRouter } from "./src/routes/moto.routes.js";
import { userRouter } from "./src/routes/user.routes.js";

export const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', userRouter);
app.use('/api', motoRouter);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  iniciarServidor(app);
}
