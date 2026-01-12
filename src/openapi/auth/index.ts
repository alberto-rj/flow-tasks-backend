import { loginRegistry } from './auth.login.path';
import { logoutRegistry } from './auth.logout.path';
import { profileRegistry } from './auth.profile.path';
import { refreshRegistry } from './auth.refresh.path';
import { registerRegistry } from './auth.register.path';

export const authDefinitions = [
  ...registerRegistry.definitions,
  ...loginRegistry.definitions,
  ...refreshRegistry.definitions,
  ...profileRegistry.definitions,
  ...logoutRegistry.definitions,
];
