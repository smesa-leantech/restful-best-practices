import NodeCache from 'node-cache';

/**
 * Clase CacheService
 * 
 * Esta clase proporciona un servicio de caché utilizando la biblioteca `node-cache`.
 * Su objetivo es mejorar el rendimiento del sistema al almacenar en caché datos
 * que se acceden con frecuencia, reduciendo así la necesidad de realizar operaciones
 * costosas repetidamente.
 * 
 * Implementa el punto 10 de las guías de rendimiento, que sugiere el uso de caché
 * para optimizar el tiempo de respuesta de la aplicación.
 */
export class CacheService {
  private cache: NodeCache; // Instancia de NodeCache para manejar el almacenamiento en caché

  /**
   * Constructor de CacheService
   * 
   * @param {number} ttlSeconds - Tiempo de vida (TTL) en segundos para los elementos en caché.
   *                              Por defecto es 60 segundos.
   */
  constructor(ttlSeconds: number = 60) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds, // Tiempo de vida estándar para los elementos en caché
      checkperiod: ttlSeconds * 0.2, // Intervalo de tiempo para verificar y limpiar elementos expirados
    });
  }

  /**
   * Obtiene un valor del caché
   * 
   * @template T
   * @param {string} key - La clave del elemento a recuperar del caché.
   * @returns {T | undefined} - El valor almacenado en caché o undefined si no existe.
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Almacena un valor en el caché
   * 
   * @template T
   * @param {string} key - La clave bajo la cual se almacenará el valor.
   * @param {T} value - El valor a almacenar en caché.
   * @param {number} ttl - Tiempo de vida en segundos para este elemento específico. Por defecto es 60 segundos.
   * @returns {boolean} - Retorna true si el valor fue almacenado exitosamente.
   */
  set<T>(key: string, value: T, ttl: number = 60): boolean {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Elimina un elemento del caché
   * 
   * @param {string} key - La clave del elemento a eliminar del caché.
   */
  del(key: string): void {
    this.cache.del(key);
  }

  /**
   * Limpia todos los elementos del caché
   * 
   * Esta función elimina todos los elementos almacenados en el caché, vaciándolo completamente.
   */
  flush(): void {
    this.cache.flushAll();
  }
}

/**
 * Instancia única de CacheService
 * 
 * Se exporta una instancia única de CacheService para ser utilizada en toda la aplicación,
 * asegurando un manejo centralizado del caché.
 */
export const cacheService = new CacheService(); 