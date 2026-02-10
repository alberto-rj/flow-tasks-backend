import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import { load } from '@/config/env';
import { authDefinitions } from './auth';
import { todosDefinitions } from './todos';

const { SERVER_URL } = load();

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
      url: `${SERVER_URL}/api`,
      description: 'Server',
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
});
