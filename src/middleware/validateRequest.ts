import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware para validar las solicitudes
 * 
 * Este middleware se encarga de validar las solicitudes entrantes utilizando las reglas de validación
 * definidas previamente con express-validator. Implementa el punto 5 de las guías de estandarización de datos,
 * asegurando que los datos de entrada cumplan con los requisitos esperados antes de ser procesados por los controladores.
 * 
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {NextFunction} next - La función next de Express para pasar el control al siguiente middleware.
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Se obtienen los errores de validación de la solicitud.
  const errors = validationResult(req);
  
  // Si hay errores de validación, se responde con un error 400 (Bad Request) y los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array()
    });
  }
  
  // Si no hay errores de validación, se llama a la función next() para continuar con el siguiente middleware o controlador.
  next();
}; 