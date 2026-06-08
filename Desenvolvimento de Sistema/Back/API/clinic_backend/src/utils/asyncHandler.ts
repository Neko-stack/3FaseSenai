import type { Request, Response } from "express";

type ControllerMethod = (req: Request, res: Response) => Promise<Response>;

export function asyncHandler(fn: ControllerMethod) {
    return async (req: Request, res: Response) => {
        try {
            return await fn(req, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    };
}
