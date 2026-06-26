import { Router } from "express";
import { FeatureController } from "../controllers/feature.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createFeatureSchema,
  updateFeatureSchema,
  idParamSchema,
  queryFeatureSchema,
} from "../validations/feature.validation";

const router = Router();

router.get("/", validate(queryFeatureSchema, "query"), FeatureController.getList);
router.get("/:id", validate(idParamSchema, "params"), FeatureController.getDetail);

// Admin-only modifying routes
router.post("/", authMiddleware, validate(createFeatureSchema), FeatureController.create);
router.patch(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  validate(updateFeatureSchema),
  FeatureController.update
);
router.delete("/:id", authMiddleware, validate(idParamSchema, "params"), FeatureController.delete);

export default router;
