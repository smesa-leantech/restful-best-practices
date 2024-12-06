import { NextFunction, Request, Response } from 'express';

/**
 * Manejador centralizado de errores
 * Punto 6: Seguridad en APIs - No exponer detalles sensibles en errores
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // No exponemos detalles internos del error en producción
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: isProduction ? 'Algo salió mal' : err.message
  });
}; 