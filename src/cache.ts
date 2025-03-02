import { Redis } from '@upstash/redis';
import { CacheService } from './types';

/**
 * Simple Redis cache service
 */
export class RedisCache implements CacheService {
  private client: Redis | null = null;
  private available: boolean = false;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    // Only initialize Redis if credentials are provided
    if (url && token) {
      try {
        this.client = new Redis({
          url,
          token,
        });
        this.available = true;
        console.log('Redis cache initialized');
      } catch (error) {
        console.error('Failed to initialize Redis cache:', error);
        this.client = null;
        this.available = false;
      }
    } else {
      console.log('Redis credentials not provided, caching disabled');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.available || !this.client) return null;

    try {
      return await this.client.get<T>(key);
    } catch (error) {
      console.error(`Redis cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 900): Promise<void> {
    if (!this.available || !this.client) return;

    try {
      await this.client.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error(`Redis cache set error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.available || !this.client) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Redis cache delete error for key ${key}:`, error);
    }
  }

  async flushall(): Promise<void> {
    if (!this.available || !this.client) return;

    try {
      await this.client.flushall();
      console.log('Redis cache flushed');
    } catch (error) {
      console.error('Redis cache flush error:', error);
    }
  }

  isAvailable(): boolean {
    return this.available;
  }
}

// Create a singleton instance
export const cacheService = new RedisCache();