import type { Exame, PrismaClient, Token, } from "../prisma/generated/prisma/";
import { prisma } from "../prisma/prisma";

export class ExamRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosExames(pagina?: number, limite?: number) {
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

    async buscarExameId(idExame: number) {
        const exame = await prisma.exame.findUnique({
            where: {
                id: idExame
            }
        })

        return exame;
    }

    async criarExame(dadosExame: Partial<Exame>) {
        if (!dadosExame.paciente_id) {if (!dadosExame.paciente_id) {
        throw new Error("O campo 'paciente_id' é obrigatório para criar um exame.");
  }
  }
        return await this.prisma.exame.create({
            data: {
                tipo_exame: dadosExame.tipo_exame || "",
                valor: dadosExame.valor || "",
                descricao: dadosExame.descricao || "",
                data_exame: new Date(dadosExame.data_exame || ""),
                resultado: dadosExame.resultado || "",
                paciente_id: dadosExame.paciente_id
            }
        })
    }

    async atualizarExame(idExame: number, dadosParaAtualizar: Omit<Exame, 'id'>) {
        const exameAtualizado = await prisma.exame.update({
            data: {
                ...dadosParaAtualizar,
                data_exame: new Date(dadosParaAtualizar.data_exame)
            },
            where: {
                id: idExame
            }
        })

        return exameAtualizado;
    }

    async deletarExame(idExame: number) {
        const usuario = await prisma.usuario.delete({
            where: {
                id: idExame
            }
        })
        return usuario;
    }
}



export const examRepository = new ExamRepository(prisma)