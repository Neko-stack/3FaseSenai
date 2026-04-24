import type { PrismaClient, Token, Exame } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ExameRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosExames() {
        const exames = await prisma.exame.findMany();
        return exames;
    }

    async buscarUsuarioId(idExame: number) {
        const exame = await prisma.exame.findUnique({
            where: {
                id: idExame
            }
        })
        return exame;
    }


    async criarExame(dadosExame: Exame) {
        return await this.prisma.exame.create({
            data: {
                tipo_exame: dadosExame.tipo_exame || "",
                valor: dadosExame.valor || "",
                descricao: dadosExame.descricao || "",
                data_exame: new Date(dadosExame.data_exame) || "",
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

        return exameAtualizado
    }
    async deletarExame(idExame: number) {
        const exameDeletado = await prisma.exame.delete({
            where: {
                id: idExame
            }
        })
        return exameDeletado;
    }
}

export const exameRepository = new ExameRepository(prisma)