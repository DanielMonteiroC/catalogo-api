const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Catálogo API',
      version: '1.0.0',
      description:
        'API híbrida com autenticação JWT, CRUD NoSQL (livros, bicicletas, marcas de tênis) e CRUD SQL (usuários).',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
