import { Request, Response } from "express";

/**
 * Health check controller
 * Returns system health status and a unique identifier
 * DO NOT CHANGE THIS AT ANY COST OTHERWISE CLIENT APPS WONT WORK
 */
export const getHealth = (req: Request, res: Response) => {
  const healthData = {
    status: "up",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    memory: process.memoryUsage().rss,
    caching: req.app.locals.cacheService.isAvailable() ? "enabled" : "disabled",
    apiSignature: "anishgowda21_torrent_api",
    ownerIdentifier: "AG21",
  };

  res.status(200).json(healthData);
};
