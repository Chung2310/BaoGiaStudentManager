import { Router } from "express";
import { SettingController } from "../controllers/setting.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createSettingSchema,
  updateSettingSchema,
  idParamSchema,
  querySettingSchema,
} from "../validations/setting.validation";

const router = Router();

// Public route to view settings (e.g. for footer)
router.get("/", validate(querySettingSchema, "query"), SettingController.getList);
router.get("/key/:key", SettingController.getByKey);
router.get("/:id", validate(idParamSchema, "params"), SettingController.getDetail);

// Admin-only routes
router.post("/", authMiddleware, validate(createSettingSchema), SettingController.create);
router.patch(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  validate(updateSettingSchema),
  SettingController.update
);
router.delete("/:id", authMiddleware, validate(idParamSchema, "params"), SettingController.delete);

export default router;
