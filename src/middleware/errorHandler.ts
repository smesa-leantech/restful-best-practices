import { NextFunction, Request, Response } from 'express';

/**
 * Manejador centralizado de errores
 * 
 * Este middleware se encarga de manejar los errores que ocurren en la aplicación de manera centralizada.
 * Implementa el punto 6 de las guías de seguridad en APIs, asegurando que no se expongan detalles sensibles
 * en los mensajes de error.
 * 
 * @param {Error} err - El objeto de error que se ha lanzado.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {NextFunction} next - La función next de Express para pasar el control al siguiente middleware.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Se registra el stack trace del error en la consola para propósitos de depuración.
  console.error(err.stack);

  // Determina si el entorno es de producción.
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Responde con un error 500 (Internal Server Error) y un mensaje adecuado.
  // En producción, no se exponen detalles internos del error para evitar fugas de información sensible.
  res.status(500).json({
    error: 'Internal Server Error',
    message: isProduction ? 'Algo salió mal' : err.message
  });
}; 