import { Router } from "express";
import authRoutes from "./auth.routes";
import pricingRoutes from "./pricing.routes";
import featureRoutes from "./feature.routes";
import serviceRoutes from "./service.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pricing", pricingRoutes);
router.use("/features", featureRoutes);
router.use("/services", serviceRoutes);

export default router;
