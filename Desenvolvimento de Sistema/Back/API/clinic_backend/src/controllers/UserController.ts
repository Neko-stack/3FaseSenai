import type { Request, Response } from "express";
import type { Usuario } from "../prisma/generated/prisma/client"
import { UserService, userService } from "../services/UserService";

class UserController {
    constructor(private readonly service: UserService) {
    }

    async listarTodosUsuarios(_: Request, res: Response) {
        try {
            const usuarios = await this.service.listarTodosUsuarios();
            return res.status(200).json(usuarios)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro interno do servidor";
            console.error("[UserController.listarTodosUsuarios]", message);
            return res.status(500).json({ error: message });
        }
    }

    async criarUsuario(req: Request, res: Response) {
        try {
            const dadosUsuario = req.body as Usuario
            const usuarioCriado = await this.service.criarUsuario(dadosUsuario)
            return res.status(201).json(usuarioCriado)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro interno do servidor";
            console.error("[UserController.criarUsuario]", message);
            return res.status(500).json({ error: message });
        }
    }

    async buscarUsuarioId(req: Request, res: Response) {
        try {
            const idUsuario = Number(req.params.id)
            const usuario = await this.service.buscarUsuarioId(idUsuario)
            return res.status(200).json(usuario)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro interno do servidor";
            console.error("[UserController.buscarUsuarioId]", message);
            return res.status(500).json({ error: message });
        }
    }

    async atualizarUsuario(req: Request, res: Response) {
        try {
            const idUsuario = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Usuario, 'id'>
            const usuarioAtualizado = await this.service.atualizarUsuario(idUsuario, dadosParaAtualizar)
            return res.status(200).json(usuarioAtualizado);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro interno do servidor";
            console.error("[UserController.atualizarUsuario]", message);
            return res.status(500).json({ error: message });
        }
    }


    async deletarUsuario(req: Request, res: Response) {
        try {
            const idUsuario = Number(req.params.id)
            const usuario = await this.service.deletarUsuario(idUsuario)
            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso!",
                data: usuario
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro interno do servidor";
            console.error("[UserController.deletarUsuario]", message);
            return res.status(500).json({ error: message });
        }
    }
}
export const userController = new UserController(userService)

