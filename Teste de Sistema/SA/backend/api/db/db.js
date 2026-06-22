import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: new URL('../.env', import.meta.url) });

export const prisma = new PrismaClient();
