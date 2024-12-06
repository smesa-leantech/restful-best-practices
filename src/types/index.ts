/**
 * Tipos y interfaces para la API
 * Punto 5: Estandarización de datos
 */

export interface User {
  id: string;
  user_name: string;
  email: string;
  birth_date: string;
  created_at: string;
  updated_at?: string;
}

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

export interface Link {
  href: string;
  method?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
} 