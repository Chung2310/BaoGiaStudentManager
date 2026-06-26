import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public: list projects (needed by public view to resolve default project)
router.get("/", ProjectController.getAll);

// Admin-only
router.post("/", authMiddleware, ProjectController.create);
router.patch("/:id", authMiddleware, ProjectController.update);
router.delete("/:id", authMiddleware, ProjectController.delete);
router.post("/:id/clone", authMiddleware, ProjectController.clone);

export default router;
