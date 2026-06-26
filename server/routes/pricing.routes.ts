import { Router } from "express";
import { PricingController } from "../controllers/pricing.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createPricingSchema,
  updatePricingSchema,
  idParamSchema,
  queryPricingSchema,
} from "../validations/pricing.validation";

const router = Router();

router.get("/", validate(queryPricingSchema, "query"), PricingController.getList);
router.get("/:id", validate(idParamSchema, "params"), PricingController.getDetail);

// Admin-only modifying routes
router.post("/", authMiddleware, validate(createPricingSchema), PricingController.create);
router.patch(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  validate(updatePricingSchema),
  PricingController.update
);
router.delete("/:id", authMiddleware, validate(idParamSchema, "params"), PricingController.delete);

export default router;
