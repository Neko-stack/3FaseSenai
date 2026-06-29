import { Router } from 'express';
import {
  atualizarPerfil,
  consultarUsuarios,
  criarUsuario,
  login,
} from '../controllers/user.controller.js';
import { exigirAutenticacao } from '../services/auth.service.js';

export const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/usuarios', criarUsuario);
userRouter.get('/usuarios', consultarUsuarios);
userRouter.put('/usuarios/me', exigirAutenticacao, atualizarPerfil);
