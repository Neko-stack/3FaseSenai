import { Router } from "express";

import { prisma } from "../prisma/prisma";

import bcrypt from "bcrypt";
import type { Usuario } from "../prisma/generated/prisma/client";
import { authController } from "../controllers/AuthController";

export const authRouter = Router();

authRouter.post("/cadastro", async (req, res) => {
    return authController.cadastrar(req, res)
})

authRouter.post("/login", async (req, res) => {
    return authController.logar(req, res)
})