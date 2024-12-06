import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Configuración de Swagger para la documentación de la API
 * 
 * Este archivo configura Swagger utilizando `swagger-jsdoc` para generar la documentación
 * de la API basada en las guías de diseño de Zalando. Swagger es una herramienta que permite
 * describir, producir, consumir y visualizar servicios web RESTful.
 */
const options = {
  definition: {
    openapi: '3.0.0', // Especifica la versión de OpenAPI utilizada.
    info: {
      title: 'API RESTful Zalando Guidelines', // Título de la API.
      version: '1.0.0', // Versión actual de la API.
      description: `
        API de ejemplo que implementa las guías de diseño de Zalando.
        
        ## Características principales
        - Autenticación OAuth2 con JWT: Implementa un sistema de autenticación seguro.
        - Paginación por cursor: Mejora la eficiencia en la recuperación de datos.
        - HATEOAS: Facilita la navegabilidad a través de los recursos de la API.
        - Versionado de API: Permite gestionar diferentes versiones de la API.
        - Documentación OpenAPI: Proporciona una descripción detallada de la API.
        - Manejo de errores estandarizado: Asegura respuestas consistentes ante errores.
        
        ## Guías implementadas
        1. Seguridad: OAuth2, rate limiting, CORS
        2. Paginación eficiente por cursor
        3. HATEOAS para navegabilidad
        4. Versionado mediante headers
        5. Compresión y caché para rendimiento
      `, // Descripción detallada de la API y sus características.
      contact: {
        name: 'API Support', // Nombre del contacto para soporte.
        email: 'smesa@lean-tech.io', // Correo electrónico de contacto.
        url: 'https://github.com/smesa-leantech/restful-best-practices' // URL para más información.
      },
      license: {
        name: 'MIT', // Tipo de licencia de la API.
        url: 'https://opensource.org/licenses/MIT' // URL de la licencia.
      }
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL del servidor de desarrollo.
        description: 'Servidor de desarrollo' // Descripción del entorno de desarrollo.
      },
      {
        url: 'https://api.produccion.com', // URL del servidor de producción.
        description: 'Servidor de producción' // Descripción del entorno de producción.
      }
    ],
    tags: [
      {
        name: 'Usuarios', // Nombre de la categoría de operaciones.
        description: 'Operaciones relacionadas con usuarios' // Descripción de las operaciones bajo esta categoría.
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http', // Tipo de esquema de seguridad.
          scheme: 'bearer', // Esquema utilizado para la autenticación.
          bearerFormat: 'JWT', // Formato del token utilizado.
          description: 'Ingrese su token JWT' // Instrucciones para el usuario sobre cómo autenticarse.
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Ruta a los archivos donde se documentan las rutas de la API.
};

/**
 * Exporta la especificación de Swagger generada.
 * 
 * `swaggerSpec` es el objeto que contiene toda la configuración y documentación
 * de la API, listo para ser utilizado por herramientas de Swagger UI o similares.
 */
export const swaggerSpec = swaggerJsdoc(options);