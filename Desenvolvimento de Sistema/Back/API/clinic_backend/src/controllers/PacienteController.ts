import type { Request, Response } from "express";
import type { Paciente } from "../prisma/generated/prisma/client"
import { PacienteService, pacienteService } from "../services/PacienteService";

class PacienteController {
    constructor(private readonly service: PacienteService) {
    }

    async listarTodosPacientes(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined

            const exames = await this.service.listarTodosPacientes(pagina, limite);
            return res.status(200).json(exames)
        } catch (error) {
            return res.status(500).json({
                error: "Erro ao listar pacientes."
            })
        }
    }

    async criarPaciente(req: Request, res: Response) {
        try {
            const dadosPaciente = req.body as Paciente
            const PacienteCriado = await this.service.criarPaciente(dadosPaciente)
            return res.status(201).json(PacienteCriado)
        } catch (error) {
            return res.status(400).json({
                error: "Erro ao criar paciente."
            })
        }
    }

    async buscarPacienteId(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const paciente = await this.service.buscarPacienteId(idPaciente)
            return res.status(200).json(paciente)
        } catch (error) {
            return res.status(404).json({
                error: "Paciente não encontrado."
            })
        }
    }

    async atualizarPaciente(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Paciente, 'id'>
            const pacienteAtualizado = await this.service.atualizarPaciente(idPaciente, dadosParaAtualizar)
            return res.status(200).json(pacienteAtualizado);
        } catch (error) {
            return res.status(400).json({
                error: "Erro ao atualizar paciente."
            })
        }
    }


    async deletarPaciente(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const paciente = await this.service.deletarPaciente(idPaciente)
            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso!",
                data: paciente
            });
        } catch (error) {
            return res.status(400).json({
                error: "Erro ao deletar paciente."
            })
        }
    }
}
export const pacienteController = new PacienteController(pacienteService)
