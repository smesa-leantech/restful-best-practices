/**
 * Tipos y interfaces comunes para la API
 * 
 * Este archivo define los tipos e interfaces que se utilizan de manera común en la API,
 * asegurando la estandarización de los datos conforme al Punto 5 de las guías de desarrollo.
 * 
 * Punto 5: Estandarización de datos
 * 
 * Las interfaces aquí definidas permiten una estructura consistente y clara para los datos
 * que se manejan en la API, facilitando su uso y comprensión.
 */

/**
 * Interfaz para representar un usuario en el sistema.
 * 
 * @property {string} id - Identificador único del usuario.
 * @property {string} user_name - Nombre de usuario.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} birth_date - Fecha de nacimiento del usuario en formato ISO 8601.
 * @property {string} created_at - Fecha de creación del usuario en formato ISO 8601.
 * @property {string} [updated_at] - Fecha de última actualización del usuario en formato ISO 8601, opcional.
 */
export interface User {
  id: string;
  user_name: string;
  email: string;
  birth_date: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Opciones para la paginación de resultados en la API.
 * 
 * @property {string} [cursor] - Cursor para la paginación basada en cursor, opcional.
 * @property {number} [limit] - Límite de resultados por página, opcional.
 * @property {string[]} [fields] - Campos específicos a incluir en la respuesta, opcional.
 */
export interface PaginationOptions {
  cursor?: string;
  limit?: number;
  fields?: string[];
}

/**
 * Estructura de la respuesta paginada de la API.
 * 
 * @template T - Tipo de los datos contenidos en la respuesta.
 * @property {T[]} data - Arreglo de datos de tipo T.
 * @property {Object} _links - Enlaces HATEOAS para la navegación de recursos.
 * @property {Link} _links.self - Enlace a la página actual.
 * @property {Link | null} [_links.next] - Enlace a la siguiente página, opcional.
 * @property {Link | null} [_links.prev] - Enlace a la página anterior, opcional.
 * @property {Object} [meta] - Metadatos adicionales sobre la paginación.
 * @property {number} [meta.total_count] - Conteo total de elementos disponibles, opcional.
 * @property {number} meta.page_size - Tamaño de la página actual.
 */
export interface PaginatedResponse<T> {
  data: T[];
  _links: {
    self: Link;
    next?: Link | null;
    prev?: Link | null;
  };
  meta?: {
    total_count?: number;
    page_size: number;
  };
}

/**
 * Representa un enlace HATEOAS en la API.
 * 
 * @property {string} href - URL del enlace.
 * @property {string} [method] - Método HTTP asociado al enlace, opcional.
 */
export interface Link {
  href: string;
  method?: string;
}

/**
 * Estructura para representar errores en la API.
 * 
 * @property {string} error - Código o tipo de error.
 * @property {string} message - Mensaje descriptivo del error.
 * @property {any} [details] - Detalles adicionales sobre el error, opcional.
 */
export interface ApiError {
  error: string;
  message: string;
  details?: any;
} 