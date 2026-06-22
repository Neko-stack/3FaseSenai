import express from "express";
import cors from "cors";
import { pathToFileURL } from "url";
import { router } from "./routes/motosRoutes.js";

export const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}
