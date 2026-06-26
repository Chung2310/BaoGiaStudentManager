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

dotenv.config();

async function startServer() {
  // Connect to Database
  await connectDB();

  // Seed Default System Data (Admin user, pricing values, features, services)
  await AuthService.seedAdmin();
  await PricingService.seedDefaultData();
  await FeatureService.seedDefaultData();
  await ServiceService.seedDefaultData();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3005;

  // Configure CORS securely using LINK_COR environment variable
  const allowedOrigins = process.env.LINK_COR 
    ? process.env.LINK_COR.split(",").map(o => o.trim().replace(/\/$/, "")) 
    : ["http://localhost:3005"];
    
  app.use(
    cors({
      origin: (origin, callback) => {
        const cleanOrigin = origin ? origin.trim().replace(/\/$/, "") : "";
        if (!origin || allowedOrigins.indexOf(cleanOrigin) !== -1 || allowedOrigins.includes("*")) {
          callback(null, true);
        } else {
          callback(new Error("Không được phép bởi CORS"));
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
