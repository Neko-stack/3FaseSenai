import type { Request, Response } from "express";
import type { Paciente } from "../prisma/generated/prisma/client"
import { PacienteService, pacienteService } from "../services/PacienteService";

class PacienteController {
    constructor(private readonly service: PacienteService) {
    }

    listarTodos = async (req: Request, res: Response) => {
        const pagina = req.query.pagina ? Number(req.query.pagina) : undefined;
        const limite = req.query.limite ? Number(req.query.limite) : undefined;
        const pacientes = await this.service.listarTodosPacientes(pagina, limite);
        return res.status(200).json(pacientes);
    }

    criar = async (req: Request, res: Response) => {
        const dadosPaciente = req.body as Paciente;
        const pacienteCriado = await this.service.criarPaciente(dadosPaciente);
        return res.status(201).json(pacienteCriado);
    }

    buscarPorId = async (req: Request, res: Response) => {
        const idPaciente = Number(req.params.id);
        const paciente = await this.service.buscarPacienteId(idPaciente);
        return res.status(200).json(paciente);
    }

    atualizar = async (req: Request, res: Response) => {
        const idPaciente = Number(req.params.id);
        const dadosParaAtualizar = req.body as Omit<Paciente, 'id'>;
        const pacienteAtualizado = await this.service.atualizarPaciente(idPaciente, dadosParaAtualizar);
        return res.status(200).json(pacienteAtualizado);
    }

    deletar = async (req: Request, res: Response) => {
        const idPaciente = Number(req.params.id);
        const paciente = await this.service.deletarPaciente(idPaciente);
        return res.status(200).json({
            mensagem: "Paciente deletado com sucesso!",
            data: paciente
        });
    }
}
export const pacienteController = new PacienteController(pacienteService)
