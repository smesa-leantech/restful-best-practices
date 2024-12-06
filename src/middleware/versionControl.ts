import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para control de versiones
 * 
 * Este middleware se encarga de gestionar el versionado de la API. Implementa el punto 8 de las guías de desarrollo,
 * asegurando que las solicitudes se manejen de acuerdo con la versión de la API especificada en los encabezados.
 * 
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {NextFunction} next - La función next de Express para pasar el control al siguiente middleware.
 */
export const versionControl = (req: Request, res: Response, next: NextFunction) => {
  // Se obtiene la versión de la API desde los encabezados de la solicitud. Si no se especifica, se asume la versión '1.0'.
  const version = req.headers['api-version'] || '1.0';
  
  // Lista de versiones soportadas por la API.
  const supportedVersions = ['1.0', '1.1', '2.0'];
  
  // Verifica si la versión solicitada está dentro de las versiones soportadas.
  if (!supportedVersions.includes(version.toString())) {
    // Si la versión no está soportada, se responde con un error 400 (Bad Request) y se proporciona información sobre las versiones soportadas.
    return res.status(400).json({
      error: 'Version Error',
      message: 'Versión de API no soportada',
      supported_versions: supportedVersions
    });
  }

  // Si la versión solicitada es '1.0', se añaden encabezados de deprecación para informar al cliente que esta versión será descontinuada.
  if (version === '1.0') {
    res.set('Deprecation', 'true'); // Indica que la versión está deprecada.
    res.set('Sunset', 'Sat, 31 Dec 2023 23:59:59 GMT'); // Fecha en la que la versión será oficialmente descontinuada.
    res.set('Link', '</api/v2>; rel="successor-version"'); // Proporciona un enlace a la versión sucesora de la API.
  }

  // Almacena la versión de la API en res.locals para que esté disponible en los siguientes middlewares o controladores.
  res.locals.apiVersion = version;
  
  // Llama a la función next() para continuar con el siguiente middleware o controlador.
  next();
}; 