import { describe, expect, it } from 'vitest';

import { getHash, hasCorrectHash } from './password';

describe('getHash', () => {
  it('should hash password', async () => {
    const password = '1234';
    const passwordHash = await getHash(password);
    const result = await hasCorrectHash(password, passwordHash);
    expect(result).toBe(true);
  });
});
