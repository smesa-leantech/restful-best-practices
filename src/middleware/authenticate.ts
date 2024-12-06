import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticación que implementa OAuth2 simplificado.
 * Este middleware se encarga de verificar la presencia y validez de un token JWT
 * en las solicitudes entrantes, asegurando que solo los usuarios autenticados puedan
 * acceder a los recursos protegidos.
 * 
 * Punto 6: Seguridad en APIs - Implementación de OAuth2
 * 
 * @param req - Objeto Request de Express que representa la solicitud HTTP.
 * @param res - Objeto Response de Express que representa la respuesta HTTP.
 * @param next - Función NextFunction de Express que se invoca para pasar el control al siguiente middleware.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Se obtiene el encabezado de autorización de la solicitud.
  const authHeader = req.headers.authorization;

  // Verifica si el encabezado de autorización está presente y comienza con 'Bearer '.
  if (!authHeader?.startsWith('Bearer ')) {
    // Si no se proporciona un token o el formato es incorrecto, se responde con un error 401.
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No se proporcionó token de autenticación'
    });
  }

  // Extrae el token JWT del encabezado de autorización.
  const token = authHeader.split(' ')[1];

  try {
    // Verifica el token utilizando la clave secreta definida en las variables de entorno.
    // Si el token es válido, se decodifica y se almacena en res.locals.user para su uso posterior.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.locals.user = decoded;
    // Llama a la función next() para continuar con el siguiente middleware o controlador.
    next();
  } catch (error) {
    // Si la verificación del token falla, se responde con un error 401 indicando que el token es inválido o ha expirado.
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token inválido o expirado'
    });
  }
}; 