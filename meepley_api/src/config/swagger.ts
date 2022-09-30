import swaggerJSDoc from 'swagger-jsdoc';

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MeePley Node.js RESTFul API with Express, Typescript, Prisma',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'MeePley Team',
        url: 'https://ua.pt',
        email: 'info@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/api/*.ts'],
};

export default swaggerJSDoc(swaggerConfig);
