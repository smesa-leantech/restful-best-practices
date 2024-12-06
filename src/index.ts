// Importación de módulos necesarios para la configuración del servidor
import compression from 'compression'; // Middleware para comprimir las respuestas HTTP, mejorando el rendimiento al reducir el tamaño de los datos transferidos.
import cors from 'cors'; // Middleware para habilitar CORS (Cross-Origin Resource Sharing), permitiendo que la API sea accesible desde diferentes dominios.
import express from 'express'; // Framework minimalista para construir aplicaciones web y APIs en Node.js.
import rateLimit from 'express-rate-limit'; // Middleware para limitar el número de solicitudes a la API, protegiendo contra ataques de denegación de servicio (DoS).
import helmet from 'helmet'; // Middleware que ayuda a proteger la aplicación de vulnerabilidades conocidas al configurar cabeceras HTTP de manera adecuada.
import swaggerUi from 'swagger-ui-express'; // Middleware para servir la interfaz de usuario de Swagger, permitiendo la visualización y prueba de la documentación de la API.
import { swaggerSpec } from './docs/swagger'; // Especificaciones de Swagger para la API, definidas en un archivo separado para mantener la organización.
import { errorHandler } from './middleware/errorHandler'; // Middleware para manejar errores de manera centralizada, mejorando la mantenibilidad del código.
import { versionControl } from './middleware/versionControl'; // Middleware para gestionar el control de versiones de la API, asegurando compatibilidad hacia atrás.
import { userRoutes } from './routes/userRoutes'; // Rutas específicas para las operaciones relacionadas con usuarios, separadas para modularidad.

/**
 * Configuración del servidor Express
 * Implementación de múltiples puntos de las guías de Zalando:
 * - Punto 6: Seguridad (helmet, cors, rate limiting)
 * - Punto 10: Rendimiento (compression)
 * - Punto 13: Documentación (swagger)
 */
const app = express(); // Creación de la instancia de la aplicación Express
const PORT = process.env.PORT || 3000; // Definición del puerto del servidor, utilizando una variable de entorno si está disponible

// Punto 10: Rendimiento - Compresión GZIP
app.use(compression()); // Se aplica compresión GZIP a las respuestas HTTP para mejorar el rendimiento al reducir el tamaño de los datos transferidos.

// Punto 6: Seguridad en APIs
app.use(helmet()); // Se utiliza Helmet para establecer cabeceras HTTP seguras, protegiendo contra vulnerabilidades como XSS, clickjacking, etc.
app.use(cors()); // Se habilita CORS para permitir que la API sea accesible desde diferentes dominios, facilitando la integración con aplicaciones externas.

// Punto 6: Seguridad en APIs - Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos para el límite de solicitudes
  max: 100 // Máximo de 100 solicitudes permitidas por ventana de tiempo, previniendo abusos y ataques de denegación de servicio
});
app.use(limiter); // Se aplica el limitador de tasa a todas las solicitudes entrantes

// Middleware básicos
app.use(express.json()); // Permite el manejo de JSON en las solicitudes, facilitando la manipulación de datos en el cuerpo de las peticiones
app.use(versionControl); // Middleware personalizado para gestionar el control de versiones de la API, asegurando que las versiones antiguas sigan funcionando

// Punto 13: Documentación - Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Configuración de la documentación de la API con Swagger, proporcionando una interfaz visual para explorar y probar los endpoints

// Punto 4: URLs amigables y Punto 7: Métodos HTTP correctos
app.use('/api/users', userRoutes); // Se definen las rutas de la API para usuarios, asegurando URLs amigables y el uso correcto de métodos HTTP

// Punto 12: Deprecación - Endpoint de ejemplo deprecado
app.get('/api/legacy', (req, res) => {
  res.set('Deprecation', 'true'); // Se establece la cabecera de deprecación para indicar que el endpoint está obsoleto
  res.set('Sunset', 'Sat, 31 Dec 2023 23:59:59 GMT'); // Se establece la fecha de desactivación del endpoint
  res.json({
    message: 'Este endpoint está deprecado, por favor use /api/users' // Mensaje informativo para los usuarios sobre la deprecación
  });
});

// Punto 11: HATEOAS - Endpoint raíz con enlaces
app.get('/api', (req, res) => {
  res.json({
    _links: {
      self: { href: '/api' }, // Enlace a sí mismo, siguiendo el principio de HATEOAS
      users: { href: '/api/users' }, // Enlace a la ruta de usuarios
      docs: { href: '/api-docs' } // Enlace a la documentación de la API
    },
    version: '2.0', // Versión actual de la API
    description: 'API RESTful siguiendo guías de Zalando' // Descripción general de la API
  });
});

// Punto 14: Buenas prácticas adicionales - Manejo de errores centralizado
app.use(errorHandler); // Se utiliza un middleware centralizado para el manejo de errores, mejorando la consistencia y mantenibilidad del código

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`); // Mensaje de consola indicando que el servidor está activo
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`); // URL para acceder a la documentación de la API
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err: Error) => {
  console.error('Error no manejado:', err.message); // Se registra el error no manejado en la consola
  process.exit(1); // Se finaliza el proceso en caso de error no manejado, asegurando que el sistema no quede en un estado inconsistente
}); 