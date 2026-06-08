import type { Request, Response } from "express";
import type { Usuario } from "../prisma/generated/prisma/client"
import { UserService, userService } from "../services/UserService";

class UserController {
    constructor(private readonly service: UserService) {
    }

    listarTodos = async (_: Request, res: Response) => {
        const usuarios = await this.service.listarTodosUsuarios();
        return res.status(200).json(usuarios);
    }

    criar = async (req: Request, res: Response) => {
        const dadosUsuario = req.body as Usuario;
        const usuarioCriado = await this.service.criarUsuario(dadosUsuario);
        return res.status(201).json(usuarioCriado);
    }

    buscarPorId = async (req: Request, res: Response) => {
        const idUsuario = Number(req.params.id);
        const usuario = await this.service.buscarUsuarioId(idUsuario);
        return res.status(200).json(usuario);
    }

    atualizar = async (req: Request, res: Response) => {
        const idUsuario = Number(req.params.id);
        const dadosParaAtualizar = req.body as Omit<Usuario, 'id'>;
        const usuarioAtualizado = await this.service.atualizarUsuario(idUsuario, dadosParaAtualizar);
        return res.status(200).json(usuarioAtualizado);
    }

    deletar = async (req: Request, res: Response) => {
        const idUsuario = Number(req.params.id);
        const usuario = await this.service.deletarUsuario(idUsuario);
        return res.status(200).json({
            mensagem: "Usuário deletado com sucesso!",
            data: usuario
        });
    }
}
export const userController = new UserController(userService)
