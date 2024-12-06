import NodeCache from 'node-cache';

/**
 * Servicio de caché para mejorar el rendimiento
 * 
 * Este servicio implementa un sistema de caché en memoria utilizando la librería `node-cache`.
 * La caché es una técnica que permite almacenar temporalmente datos en memoria para reducir
 * el tiempo de acceso y mejorar el rendimiento de la aplicación.
 * 
 * Punto 10: Rendimiento - Implementación de caché
 * 
 * La implementación de caché es crucial para optimizar el rendimiento, especialmente en aplicaciones
 * que requieren acceso frecuente a datos que no cambian con frecuencia.
 */
class CacheService {
  private cache: NodeCache;

  /**
   * Constructor de la clase CacheService.
   * 
   * @param {number} ttlSeconds - Tiempo de vida (TTL) en segundos para los elementos en caché.
   *                              Por defecto es 60 segundos.
   * 
   * Se inicializa una instancia de `NodeCache` con un TTL estándar y un periodo de verificación
   * para limpiar elementos expirados.
   */
  constructor(ttlSeconds: number = 60) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds, // Tiempo de vida estándar para los elementos en caché.
      checkperiod: ttlSeconds * 0.2, // Periodo de verificación para limpiar elementos expirados.
    });
  }

  /**
   * Obtiene un valor de la caché.
   * 
   * @template T - Tipo del valor almacenado.
   * @param {string} key - Clave del elemento a obtener.
   * @returns {T | undefined} - Retorna el valor almacenado o `undefined` si no existe.
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Almacena un valor en la caché.
   * 
   * @template T - Tipo del valor a almacenar.
   * @param {string} key - Clave del elemento a almacenar.
   * @param {T} value - Valor a almacenar en la caché.
   * @param {number} ttl - Tiempo de vida en segundos para este elemento específico.
   *                       Por defecto es 60 segundos.
   * @returns {boolean} - Retorna `true` si el valor fue almacenado exitosamente.
   */
  set<T>(key: string, value: T, ttl: number = 60): boolean {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Elimina un elemento de la caché.
   * 
   * @param {string} key - Clave del elemento a eliminar.
   */
  del(key: string): void {
    this.cache.del(key);
  }

  /**
   * Limpia todos los elementos de la caché.
   * 
   * Esta operación elimina todos los elementos almacenados en la caché, liberando memoria.
   */
  flush(): void {
    this.cache.flushAll();
  }
}

/**
 * Exporta una instancia única de CacheService.
 * 
 * Esta instancia puede ser utilizada en toda la aplicación para gestionar el almacenamiento
 * en caché de manera centralizada.
 */
export const cacheService = new CacheService(); 