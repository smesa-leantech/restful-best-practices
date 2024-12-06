import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controlador para la gestión de usuarios
 * Implementa varios principios de diseño de APIs RESTful
 */
export class UserController {
  private users: any[] = [];

  /**
   * Obtiene la lista de usuarios con soporte para paginación por cursor
   * Punto 9: Paginación eficiente
   * Punto 11: HATEOAS - Enlaces incluidos en la respuesta
   */
  async getUsers(req: Request, res: Response) {
    const { cursor, limit = 10, fields } = req.query;
    const selectedFields = fields ? String(fields).split(',') : undefined;

    let filteredUsers = [...this.users];
    
    if (cursor) {
      const cursorIndex = this.users.findIndex(u => u.id === cursor);
      filteredUsers = this.users.slice(cursorIndex + 1);
    }

    const paginatedUsers = filteredUsers.slice(0, Number(limit));
    const nextCursor = paginatedUsers.length > 0 ? 
      paginatedUsers[paginatedUsers.length - 1].id : 
      null;

    // Implementación de HATEOAS
    const response = {
      data: paginatedUsers,
      _links: {
        self: { href: `/api/users?limit=${limit}` },
        next: nextCursor ? 
          { href: `/api/users?cursor=${nextCursor}&limit=${limit}` } : 
          null
      }
    };

    // Implementación de Sunset header para endpoints deprecados
    if (req.headers['api-version'] === '1.0') {
      res.set('Deprecation', 'true');
      res.set('Sunset', 'Sat, 31 Dec 2023 23:59:59 GMT');
    }

    res.json(response);
  }

  /**
   * Crea un nuevo usuario
   * Punto 5: Estandarización de datos
   * Punto 7: Métodos HTTP correctos
   */
  async createUser(req: Request, res: Response) {
    const { user_name, email, birth_date } = req.body;
    
    const newUser = {
      id: uuidv4(),
      user_name,
      email,
      birth_date,
      created_at: new Date().toISOString()
    };

    this.users.push(newUser);

    res.status(201).json({
      data: newUser,
      _links: {
        self: { href: `/api/users/${newUser.id}` },
        update: { href: `/api/users/${newUser.id}`, method: 'PATCH' },
        delete: { href: `/api/users/${newUser.id}`, method: 'DELETE' }
      }
    });
  }

  /**
   * Actualiza parcialmente un usuario
   * Punto 7: Métodos HTTP correctos - PATCH para actualizaciones parciales
   */
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Usuario no encontrado'
      });
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    res.json({
      data: this.users[userIndex],
      _links: {
        self: { href: `/api/users/${id}` }
      }
    });
  }
} 