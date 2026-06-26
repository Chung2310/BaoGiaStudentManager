import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import { logger } from "./server/config/logger";

import { connectDB } from "./server/config/db";
import apiRoutes from "./server/routes/index";
import { swaggerSpec } from "./server/swagger";
import { errorMiddleware } from "./server/middlewares/error.middleware";
import { requestLoggerMiddleware } from "./server/middlewares/logger.middleware";
import { AuthService } from "./server/services/auth.service";
import { PricingService } from "./server/services/pricing.service";
import { FeatureService } from "./server/services/feature.service";
import { ServiceService } from "./server/services/service.service";
import { PackageService } from "./server/services/package.service";
import { SettingService } from "./server/services/setting.service";
import { ProjectService } from "./server/services/project.service";

dotenv.config();

async function startServer() {
  // Connect to Database
  await connectDB();

  // Seed Default System Data (Admin user, projects, pricing values, features, services, settings)
  await AuthService.seedAdmin();
  const defaultProject = await ProjectService.seedDefaultProject();
  await PackageService.seedDefaultData(defaultProject._id);
  await PricingService.seedDefaultData(defaultProject._id);
  await FeatureService.seedDefaultData(defaultProject._id);
  await ServiceService.seedDefaultData(defaultProject._id);
  await SettingService.seedDefaultData();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3004;

  // Configure CORS securely using LINK_COR environment variable
  const allowedOrigins = process.env.LINK_COR
    ? process.env.LINK_COR.split(",")
        .map(o => o.trim())
        .filter(Boolean)
        .map(o => o.replace(/\/$/, ""))
    : ["http://localhost:3004"];
    
  // Proactively whitelist local address for development & Swagger API Docs
  const localOrigin = `http://localhost:${PORT}`;
  const local127 = `http://127.0.0.1:${PORT}`;
  if (!allowedOrigins.includes(localOrigin)) allowedOrigins.push(localOrigin);
  if (!allowedOrigins.includes(local127)) allowedOrigins.push(local127);
    
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }
        const cleanOrigin = origin.trim().replace(/\/$/, "");
        const isAllowed = allowedOrigins.some(allowed => {
          if (allowed === "*") return true;
          return allowed.replace(/\/$/, "") === cleanOrigin;
        });

        if (isAllowed) {
          callback(null, true);
        } else {
          logger.warn(`[CORS] Blocked access from unauthorized origin: ${origin}`);
          callback(new Error(`Không được phép bởi CORS cho origin: ${origin}`));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(requestLoggerMiddleware);

  // Swagger Documentation API Docs
  app.use("/api-docs", swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any);

  // Health Check Endpoint
  app.get("/api/v1/health", (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      res.json({ success: true, status: "OK", database: "Connected" });
    } else {
      res.status(500).json({ success: false, status: "Error", database: "Disconnected" });
    }
  });

  // REST API Routes
  app.use("/api/v1", apiRoutes);

  // Error Handler Middleware
  app.use(errorMiddleware);

  // Serve Frontend client SPA via Vite in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else if (filePath.includes(path.sep + 'assets' + path.sep) || /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|eot|ttf)$/.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));

    app.get('*', (req, res) => {
      const ext = path.extname(req.path);
      if (ext && ext !== '.html') {
        return res.status(404).send('Asset not found');
      }
      if (req.path.startsWith('/assets/')) {
        return res.status(404).send('Asset not found');
      }

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Swagger API Docs available at http://localhost:${PORT}/api-docs`);
  });
}

startServer();
