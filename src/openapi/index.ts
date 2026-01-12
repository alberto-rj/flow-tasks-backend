import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import { authDefinitions } from './auth';
import { todosDefinitions } from './todos';

const definitions = [...todosDefinitions, ...authDefinitions];

const generator = new OpenApiGeneratorV31(definitions);

export const openapi = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'FlowTasks API',
    version: '1.0.0',
    contact: {
      name: 'Alberto José',
      url: 'https://github.com/alberto-rj',
      email: 'albertorauljose2@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://api.flowtasks.com/api',
      description: 'Production server',
    },
    {
      url: 'http://localhost:4224/api',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Todos',
      description: 'Todos management',
    },
    {
      name: 'Authentication',
      description: 'User authentication management',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
      },
    },
  },
});
