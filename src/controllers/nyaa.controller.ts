import { Request, Response } from 'express';
import nyaaSearch from '../torrent/nyaa';
import { createDocumentationHandler } from '../utils';

/**
 * Nyaa documentation controller
 */
export const getNyaaDocs = createDocumentationHandler('../docs/nyaa.md', 'Nyaa API Documentation');

/**
 * Search Nyaa torrents
 */
export const searchNyaa = async (req: Request, res: Response) => {
  const { cacheService } = req.app.locals;
  
  if (!req.query.query || typeof req.query.query !== 'string') {
    return res.status(400).send("Please provide a query\nExample: /nyaa?query=naruto");
  }

  const query = encodeURI(req.query.query);
  const orderBy = req.query.ord_by === 'date' ? 'id' : 'seeders';
  const page = req.query.page ? parseInt(req.query.page as string) : 1;

  try {
    // Try to get from cache
    const cacheKey = `nyaa:${query}:${orderBy}:${page}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    // Not in cache, fetch new data
    const data = await nyaaSearch(query, orderBy, page);
    
    // Save to cache for 15 minutes
    if (data.status === 'success') {
      await cacheService.set(cacheKey, data, 900);
    }
    
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('content-type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Error: ${(err as Error).message}`,
    });
  }
};