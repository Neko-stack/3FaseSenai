import { Router } from 'express';
import {
  alterarMoto,
  consultarMotos,
  criarMoto,
  removerMoto,
} from '../controllers/moto.controller.js';
import { exigirAutenticacao } from '../services/auth.service.js';

export const motoRouter = Router();

motoRouter.get('/motos', consultarMotos);
motoRouter.post('/motos', exigirAutenticacao, criarMoto);
motoRouter.put('/motos/:id', exigirAutenticacao, alterarMoto);
motoRouter.delete('/motos/:id', exigirAutenticacao, removerMoto);
