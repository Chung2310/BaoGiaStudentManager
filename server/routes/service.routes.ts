import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createServiceSchema,
  updateServiceSchema,
  idParamSchema,
  queryServiceSchema,
} from "../validations/service.validation";

const router = Router();

router.get("/", validate(queryServiceSchema, "query"), ServiceController.getList);
router.get("/:id", validate(idParamSchema, "params"), ServiceController.getDetail);

// Admin-only modifying routes
router.post("/", authMiddleware, validate(createServiceSchema), ServiceController.create);
router.patch(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  validate(updateServiceSchema),
  ServiceController.update
);
router.delete("/:id", authMiddleware, validate(idParamSchema, "params"), ServiceController.delete);

export default router;
