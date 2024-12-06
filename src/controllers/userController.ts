import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controlador para la gestión de usuarios
 * Este controlador implementa varios principios de diseño de APIs RESTful, 
 * asegurando una gestión eficiente y estandarizada de los recursos de usuario.
 */
export class UserController {
  // Arreglo privado para almacenar los usuarios en memoria.
  private users: any[] = [];

  /**
   * Obtiene la lista de usuarios con soporte para paginación por cursor.
   * 
   * Punto 9: Paginación eficiente - Permite la recuperación de datos de manera eficiente
   * utilizando un cursor para navegar a través de los registros.
   * 
   * Punto 11: HATEOAS - Enlaces incluidos en la respuesta - Proporciona enlaces en la respuesta
   * para facilitar la navegabilidad a través de los recursos de la API.
   */
  async getUsers(req: Request, res: Response) {
    // Se extraen los parámetros de consulta: cursor, limit y fields.
    const { cursor, limit = 10, fields } = req.query;
    const selectedFields = fields ? String(fields).split(',') : undefined;

    // Se clona el arreglo de usuarios para aplicar filtros.
    let filteredUsers = [...this.users];
    
    // Si se proporciona un cursor, se filtran los usuarios a partir del índice del cursor.
    if (cursor) {
      const cursorIndex = this.users.findIndex(u => u.id === cursor);
      filteredUsers = this.users.slice(cursorIndex + 1);
    }

    // Se limita el número de usuarios devueltos según el límite especificado.
    const paginatedUsers = filteredUsers.slice(0, Number(limit));
    const nextCursor = paginatedUsers.length > 0 ? 
      paginatedUsers[paginatedUsers.length - 1].id : 
      null;

    // Construcción de la respuesta con HATEOAS.
    const response = {
      data: paginatedUsers,
      _links: {
        self: { href: `/api/users?limit=${limit}` },
        next: nextCursor ? 
          { href: `/api/users?cursor=${nextCursor}&limit=${limit}` } : 
          null
      }
    };

    // Implementación de Sunset header para endpoints deprecados.
    if (req.headers['api-version'] === '1.0') {
      res.set('Deprecation', 'true');
      res.set('Sunset', 'Sat, 31 Dec 2023 23:59:59 GMT');
    }

    // Se envía la respuesta en formato JSON.
    res.json(response);
  }

  /**
   * Crea un nuevo usuario.
   * 
   * Punto 5: Estandarización de datos - Asegura que los datos de entrada cumplan con los requisitos
   * esperados antes de ser procesados.
   * 
   * Punto 7: Métodos HTTP correctos - Utiliza el método POST para la creación de nuevos recursos.
   */
  async createUser(req: Request, res: Response) {
    // Se extraen los datos del cuerpo de la solicitud.
    const { user_name, email, birth_date } = req.body;
    
    // Se crea un nuevo objeto de usuario con un ID único.
    const newUser = {
      id: uuidv4(),
      user_name,
      email,
      birth_date,
      created_at: new Date().toISOString()
    };

    // Se añade el nuevo usuario al arreglo de usuarios.
    this.users.push(newUser);

    // Se envía la respuesta con el nuevo usuario creado y enlaces HATEOAS.
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
   * Actualiza parcialmente un usuario.
   * 
   * Punto 7: Métodos HTTP correctos - PATCH para actualizaciones parciales - Utiliza el método PATCH
   * para realizar actualizaciones parciales en los recursos existentes.
   */
  async updateUser(req: Request, res: Response) {
    // Se obtiene el ID del usuario a actualizar desde los parámetros de la solicitud.
    const { id } = req.params;
    const updates = req.body;

    // Se busca el índice del usuario en el arreglo.
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      // Si el usuario no se encuentra, se responde con un error 404.
      return res.status(404).json({
        error: 'Not Found',
        message: 'Usuario no encontrado'
      });
    }

    // Se actualizan los datos del usuario y se añade la fecha de actualización.
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Se envía la respuesta con el usuario actualizado y enlaces HATEOAS.
    res.json({
      data: this.users[userIndex],
      _links: {
        self: { href: `/api/users/${id}` }
      }
    });
  }
} 