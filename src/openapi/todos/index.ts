import { createRegistry } from './todos.create.path';
import { deleteRegistry } from './todos.delete.path';
import { deleteListRegistry } from './todos.delete-list.path';
import { reorderListRegistry } from './todos.reorder-list.path';
import { toggleRegistry } from './todos.toggle';
import { updateRegistry } from './todos.update';
import { statsRegistry } from './todos.stats.path';
import { listRegistry } from './todos.list.path';

export const todosDefinitions = [
  ...createRegistry.definitions,
  ...updateRegistry.definitions,
  ...toggleRegistry.definitions,
  ...deleteRegistry.definitions,
  ...deleteListRegistry.definitions,
  ...reorderListRegistry.definitions,
  ...statsRegistry.definitions,
  ...listRegistry.definitions,
];
