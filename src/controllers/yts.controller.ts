import { Request, Response } from "express";
import ytsSearch from "../torrent/yts";
import { createDocumentationHandler } from "../utils";

/**
 * YTS documentation controller
 */
export const getYtsDocs = createDocumentationHandler(
  "../docs/yts.md",
  "YTS API Documentation"
);

/**
 * Search YTS torrents
 */
export const searchYts = async (req: Request, res: Response) => {
  const { cacheService } = req.app.locals;

  if (!req.query.query || typeof req.query.query !== "string") {
    return res
      .status(400)
      .send("Please provide a query\nExample: /yts?query=hulk");
  }

  try {
    // Try to get from cache
    const cacheKey = `yts:${req.query.query}:${
      req.query.img ? "with-img" : "no-img"
    }`;
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    // Include images if img parameter is present
    const includeImages = !!req.query.img;

    // Not in cache, fetch new data
    const data = await ytsSearch(req.query.query, includeImages);

    // Save to cache for 15 minutes
    if (data.status === "ok") {
      await cacheService.set(cacheKey, data, 900);
    }

    res.setHeader("X-Cache", "MISS");
    res.setHeader("content-type", "application/json");

    if (data.status === "ok") {
      res.status(200).json(data);
    } else {
      res.status(500).json(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Error: ${(err as Error).message}`,
    });
  }
};
