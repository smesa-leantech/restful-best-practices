import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para control de versiones
 * Punto 8: Versionado
 */
export const versionControl = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers['api-version'] || '1.0';
  
  // Verificar si la versión está soportada
  const supportedVersions = ['1.0', '1.1', '2.0'];
  if (!supportedVersions.includes(version.toString())) {
    return res.status(400).json({
      error: 'Version Error',
      message: 'Versión de API no soportada',
      supported_versions: supportedVersions
    });
  }

  // Agregar información de deprecación para versiones antiguas
  if (version === '1.0') {
    res.set('Deprecation', 'true');
    res.set('Sunset', 'Sat, 31 Dec 2023 23:59:59 GMT');
    res.set('Link', '</api/v2>; rel="successor-version"');
  }

  res.locals.apiVersion = version;
  next();
}; 