import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RESTful Zalando Guidelines',
      version: '1.0.0',
      description: `
        API de ejemplo que implementa las guías de diseño de Zalando.
        
        ## Características principales
        - Autenticación OAuth2 con JWT
        - Paginación por cursor
        - HATEOAS
        - Versionado de API
        - Documentación OpenAPI
        - Manejo de errores estandarizado
        
        ## Guías implementadas
        1. Seguridad: OAuth2, rate limiting, CORS
        2. Paginación eficiente por cursor
        3. HATEOAS para navegabilidad
        4. Versionado mediante headers
        5. Compresión y caché para rendimiento
      `,
      contact: {
        name: 'API Support',
        email: 'smesa@lean-tech.io',
        url: 'https://github.com/smesa-leantech/restful-best-practices'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.produccion.com',
        description: 'Servidor de producción'
      }
    ],
    tags: [
      {
        name: 'Usuarios',
        description: 'Operaciones relacionadas con usuarios'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);