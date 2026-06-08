import type { Response, Request, NextFunction } from "express";
import { extractAndVerifyToken } from "../utils/extractToken";

export function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = extractAndVerifyToken(req, res);
        if (!token) return;
        next();
    } catch {
        return res.status(401).json({ error: "invalid or expired token" });
    }
}
