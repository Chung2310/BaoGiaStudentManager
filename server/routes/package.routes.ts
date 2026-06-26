import { Router } from "express";
import { PackageController } from "../controllers/package.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createPackageSchema,
  updatePackageSchema,
  idParamSchema,
  queryPackageSchema,
} from "../validations/package.validation";

const router = Router();

// Public routes
router.get("/", validate(queryPackageSchema, "query"), PackageController.getList);
router.get("/all", PackageController.getAll);
router.get("/:id", validate(idParamSchema, "params"), PackageController.getDetail);

// Admin-only modifying routes
router.post("/", authMiddleware, validate(createPackageSchema), PackageController.create);
router.patch(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  validate(updatePackageSchema),
  PackageController.update
);
router.delete("/:id", authMiddleware, validate(idParamSchema, "params"), PackageController.delete);

export default router;
