import { Request, Response } from "express";
import { createDocumentationHandler } from "../utils";

/**
 * Home page controller
 */
export const getHome = createDocumentationHandler(
  "../docs/home.md",
  "Torrent API Documentation"
);

/**
 * Clear cache controller
 */
export const clearCache = async (req: Request, res: Response) => {
  const { cacheService } = req.app.locals;
  const { password } = req.query;

  if (!password || password !== process.env.CACHE_CLEAR_PASSWORD) {
    return res.status(403).json({ error: "Invalid or missing password" });
  }

  try {
    await cacheService.flushall();
    res.status(200).json({ message: "Cache cleared successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to clear cache: ${(err as Error).message}` });
  }
};
