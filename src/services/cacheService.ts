import NodeCache from 'node-cache';

/**
 * Servicio de caché para mejorar el rendimiento
 * Punto 10: Rendimiento - Implementación de caché
 */
export class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 60) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl: number = 60): boolean {
    return this.cache.set(key, value, ttl);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }
}

export const cacheService = new CacheService(); 