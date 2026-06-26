import { Router } from "express";
import authRoutes from "./auth.routes";
import pricingRoutes from "./pricing.routes";
import featureRoutes from "./feature.routes";
import serviceRoutes from "./service.routes";
import packageRoutes from "./package.routes";
import settingRoutes from "./setting.routes";
import projectRoutes from "./project.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/pricing", pricingRoutes);
router.use("/features", featureRoutes);
router.use("/services", serviceRoutes);
router.use("/packages", packageRoutes);
router.use("/settings", settingRoutes);

export default router;
