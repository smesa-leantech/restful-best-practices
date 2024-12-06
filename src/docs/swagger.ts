import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Configuración de Swagger/OpenAPI
 * Punto 13: Documentación
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RESTful Zalando Guidelines',
      version: '1.0.0',
      description: 'API de ejemplo siguiendo las guías de diseño de Zalando',
      contact: {
        name: 'API Support',
        email: 'support@api.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 