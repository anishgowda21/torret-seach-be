import express, { Request, Response, NextFunction } from "express";
import path from "path";
import {
  homeRoutes,
  _1337xRoutes,
  nyaaRoutes,
  ytsRoutes,
  healthRoutes,
} from "./routes";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

// Load cacheservice after dotenv config
import { cacheService } from "./cache";

// Initialize express
const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());
// Store cache service in app locals for access in controllers
app.locals.cacheService = cacheService;

app.use(express.static(path.join(__dirname, "public")));
// Mount routes
app.use("/", homeRoutes);
app.use("/1337x", _1337xRoutes);
app.use("/nyaa", nyaaRoutes);
app.use("/yts", ytsRoutes);
app.use("/health", healthRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Log caching status
  if (cacheService.isAvailable()) {
    console.log("Redis caching enabled");
  } else {
    console.log(
      "Redis caching disabled - provide UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable"
    );
  }
});
