import type { PrismaClient, Token, Paciente } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class PacienteRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosPacientes(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.exame.findMany()
        const exames = await prisma.exame.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })

        const total = await prisma.exame.count();
        const totalPaginas = Math.ceil(total / limite)
        return {
            exames,
            total,
            totalPaginas
        }
    }

    async buscarPacienteId(idPaciente: number) {
        const paciente = await prisma.paciente.findUnique({
            where: {
                id: idPaciente
            }
        })
        return paciente;
    }

    async criarPaciente(dadosPaciente: Partial<Paciente>) {
        console.log(dadosPaciente)
        return await this.prisma.paciente.create({
            data: {
                nome: dadosPaciente.nome || "",
                cpf: dadosPaciente.cpf || "",
                telefone: dadosPaciente.telefone || "",
                email: dadosPaciente.email || "",
                data_nascimento: dadosPaciente.data_nascimento || "",
                sexo: dadosPaciente.sexo || "",
                responsavel: dadosPaciente.responsavel || "",


            }
        })
    }

    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Omit<Paciente, 'id'>) {
        const PacienteAtualizado = await prisma.usuario.update({
            data: {
                ...dadosParaAtualizar
            },
            where: {
                id: idPaciente
            }
        })

        return PacienteAtualizado
    }
    async deletarPaciente(idPaciente: number) {
        const paciente = await prisma.paciente.delete({
            where: {
                id: idPaciente
            }
        })
        return paciente;
    }
}

export const pacienteRepository = new PacienteRepository(prisma)
