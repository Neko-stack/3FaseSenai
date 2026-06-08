import type { NextFunction, Request, Response } from "express";
import type { Role } from "../prisma/generated/prisma/enums";
import { extractAndVerifyToken } from "../utils/extractToken";
import { getToken } from "../utils/jwt";

export function roleMiddleware(roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = extractAndVerifyToken(req, res);
            if (!token) return;

            const tokenData = getToken(token);
            if (tokenData?.role && !roles.includes(tokenData.role)) {
                return res.status(401).json({ error: "Access denied." });
            }
            next();
        } catch {
            return res.status(401).json({ error: "invalid or expired token" });
        }
    }
}
