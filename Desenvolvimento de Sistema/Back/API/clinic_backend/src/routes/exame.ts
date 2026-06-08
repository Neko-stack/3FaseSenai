import { examController } from "../controllers/ExamController";
import { createCrudRoutes } from "../utils/createCrudRoutes";

export const exameRouter = createCrudRoutes("exames", examController);
