import type { PrismaClient, Paciente } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";
import { buildPaginationArgs, buildPaginatedResponse } from "../utils/paginate";

export class PacienteRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosPacientes(pagina?: number, limite?: number) {
        const pagination = buildPaginationArgs({ pagina, limite });
        if (!pagination) return await prisma.paciente.findMany();

        const pacientes = await prisma.paciente.findMany({
            skip: pagination.skip,
            take: pagination.take
        });
        const total = await prisma.paciente.count();
        return buildPaginatedResponse(pacientes, total, limite!);
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
        const pacienteAtualizado = await prisma.paciente.update({
            data: {
                ...dadosParaAtualizar
            },
            where: {
                id: idPaciente
            }
        })
        return pacienteAtualizado
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
