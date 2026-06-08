import { Router } from "express";
import type { Request, Response } from "express";
import { asyncHandler } from "./asyncHandler";

interface CrudController {
    listarTodos: (req: Request, res: Response) => Promise<Response>;
    buscarPorId: (req: Request, res: Response) => Promise<Response>;
    criar: (req: Request, res: Response) => Promise<Response>;
    atualizar: (req: Request, res: Response) => Promise<Response>;
    deletar: (req: Request, res: Response) => Promise<Response>;
}

export function createCrudRoutes(basePath: string, controller: CrudController): Router {
    const router = Router();

    router.get(`/${basePath}`, asyncHandler(controller.listarTodos));
    router.get(`/${basePath}/:id`, asyncHandler(controller.buscarPorId));
    router.post(`/${basePath}`, asyncHandler(controller.criar));
    router.put(`/${basePath}/:id`, asyncHandler(controller.atualizar));
    router.delete(`/${basePath}/:id`, asyncHandler(controller.deletar));

    return router;
}
