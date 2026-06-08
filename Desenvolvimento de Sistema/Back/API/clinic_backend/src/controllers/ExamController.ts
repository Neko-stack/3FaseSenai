import type { Request, Response } from "express";
import type { Exame } from "../prisma/generated/prisma/client"
import { examService, ExamService } from "../services/ExamService";

class ExamController {
    constructor(private readonly service: ExamService) {
    }

    listarTodos = async (req: Request, res: Response) => {
        const pagina = req.query.pagina ? Number(req.query.pagina) : undefined;
        const limite = req.query.limite ? Number(req.query.limite) : undefined;
        const exames = await this.service.listarTodosExames(pagina, limite);
        return res.status(200).json(exames);
    }

    criar = async (req: Request, res: Response) => {
        const dadosExame = req.body as Exame;
        const exameCriado = await this.service.criarExame(dadosExame);
        return res.status(201).json(exameCriado);
    }

    buscarPorId = async (req: Request, res: Response) => {
        const idExame = Number(req.params.id);
        const exame = await this.service.buscarExameId(idExame);
        return res.status(200).json(exame);
    }

    atualizar = async (req: Request, res: Response) => {
        const idExame = Number(req.params.id);
        const dadosParaAtualizar = req.body as Omit<Exame, 'id'>;
        const exameAtualizado = await this.service.atualizarExame(idExame, dadosParaAtualizar);
        return res.status(200).json(exameAtualizado);
    }

    deletar = async (req: Request, res: Response) => {
        const idExame = Number(req.params.id);
        const exame = await this.service.deletarExame(idExame);
        return res.status(200).json({
            mensagem: "Exame deletado com sucesso!",
            data: exame
        });
    }
}
export const examController = new ExamController(examService)
