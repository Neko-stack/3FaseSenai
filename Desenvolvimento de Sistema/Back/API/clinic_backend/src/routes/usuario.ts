import { userController } from "../controllers/UserController";
import { createCrudRoutes } from "../utils/createCrudRoutes";

export const usuarioRouter = createCrudRoutes("usuarios", userController);
