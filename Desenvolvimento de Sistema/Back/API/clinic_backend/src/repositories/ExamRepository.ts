import type { Exame, PrismaClient } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";
import { buildPaginationArgs, buildPaginatedResponse } from "../utils/paginate";

export class ExamRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosExames(pagina?: number, limite?: number) {
        const pagination = buildPaginationArgs({ pagina, limite });
        if (!pagination) return await prisma.exame.findMany();

        const exames = await prisma.exame.findMany({
            skip: pagination.skip,
            take: pagination.take
        });
        const total = await prisma.exame.count();
        return buildPaginatedResponse(exames, total, limite!);
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
        return await this.prisma.exame.create({
            data: {
                tipo_exame: dadosExame.tipo_exame || "",
                valor: dadosExame.valor || "",
                descricao: dadosExame.descricao || "",
                data_exame: new Date(dadosExame.data_exame || ""),
                resultado: dadosExame.resultado || ""
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
        const exame = await prisma.exame.delete({
            where: {
                id: idExame
            }
        })
        return exame;
    }
}

export const examRepository = new ExamRepository(prisma)
