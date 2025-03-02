import { Request, Response } from "express";
import * as torrent1337x from "../torrent/1337x";
import { createDocumentationHandler } from "../utils";

/**
 * 1337x documentation controller
 */
export const get1337xDocs = createDocumentationHandler(
  "../docs/1337x.md",
  "1337x API Documentation"
);

/**
 * Search 1337x torrents
 */
export const search1337x = async (req: Request, res: Response) => {
  const { cacheService } = req.app.locals;
  const { query, page, category, sort, order } = req.query;

  // Check for required parameter
  if (!query || typeof query !== "string" || !query.trim()) {
    return res
      .status(400)
      .json({ error: "Please provide a valid search query" });
  }

  const trimmedQuery = query.trim();
  const pageNum = page ? parseInt(page as string) : 1;
  const orderStr = (order as string) || "desc";

  try {
    const cacheKey = `search:${trimmedQuery.toLowerCase()}:${pageNum}:${
      category || "all"
    }:${sort || "seeders"}:${orderStr}`;

    // Try to get from cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    // Not in cache, fetch new data
    const data = await torrent1337x.search(
      trimmedQuery,
      pageNum,
      (category as string) || null,
      (sort as string) || null,
      orderStr
    );

    // Save to cache for 15 minutes
    await cacheService.set(cacheKey, data, 900);

    res.setHeader("X-Cache", "MISS");
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Error: ${(err as Error).message}`,
    });
  }
};

/**
 * Get 1337x torrent details
 */
export const get1337xDetails = async (req: Request, res: Response) => {
  const { cacheService } = req.app.locals;
  const { link } = req.query;

  if (!link || typeof link !== "string") {
    return res.status(400).json({ error: "Please provide a torrent link" });
  }

  try {
    const cacheKey = `details:${link}`;

    // Try to get from cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    // Not in cache, fetch new data
    const data = await torrent1337x.getDetails(link);

    // Save to cache for 24 hours
    await cacheService.set(cacheKey, data, 86400);

    res.setHeader("X-Cache", "MISS");
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Error: ${(err as Error).message}`,
    });
  }
};
