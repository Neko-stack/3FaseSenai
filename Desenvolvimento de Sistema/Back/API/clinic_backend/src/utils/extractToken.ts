import type { Request, Response } from "express";
import { verificarTokenAcesso } from "./jwt";

export function extractAndVerifyToken(req: Request, res: Response): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ error: "missing token" });
        return null;
    }

    const token = header.slice("Bearer ".length);
    const payload = verificarTokenAcesso(token);
    if (!payload) {
        res.status(401).json({ error: "invalid token" });
        return null;
    }

    return token;
}
