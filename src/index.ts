import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { errorHandler } from './middleware/errorHandler';
import { versionControl } from './middleware/versionControl';
import { userRoutes } from './routes/userRoutes';

/**
 * Configuración del servidor Express
 * Implementación de múltiples puntos de las guías de Zalando:
 * - Punto 6: Seguridad (helmet, cors, rate limiting)
 * - Punto 10: Rendimiento (compression)
 * - Punto 13: Documentación (swagger)
 */
const app = express();
const PORT = process.env.PORT || 3000;

// Punto 10: Rendimiento - Compresión GZIP
app.use(compression());

// Punto 6: Seguridad en APIs
app.use(helmet());
app.use(cors());

// Punto 6: Seguridad en APIs - Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 solicitudes por ventana
});
app.use(limiter);

// Middleware basicos
app.use(express.json());
app.use(versionControl);

// Punto 13: Documentación - Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Punto 4: URLs amigables y Punto 7: Métodos HTTP correctos
app.use('/api/users', userRoutes);

// Punto 12: Deprecación - Endpoint de ejemplo deprecado
app.get('/api/legacy', (req, res) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 31 Dec 2023 23:59:59 GMT');
  res.json({
    message: 'Este endpoint está deprecado, por favor use /api/users'
  });
});

// Punto 11: HATEOAS - Endpoint raíz con enlaces
app.get('/api', (req, res) => {
  res.json({
    _links: {
      self: { href: '/api' },
      users: { href: '/api/users' },
      docs: { href: '/api-docs' }
    },
    version: '2.0',
    description: 'API RESTful siguiendo guías de Zalando'
  });
});

// Punto 14: Buenas prácticas adicionales - Manejo de errores centralizado
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err: Error) => {
  console.error('Error no manejado:', err.message);
  process.exit(1);
}); 