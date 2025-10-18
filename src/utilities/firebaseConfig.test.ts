import { describe, it, expect } from 'vitest';
import * as firebaseConfig from './firebaseConfig';

describe('firebaseConfig', () => {
  it('exports db instance', () => {
    expect(firebaseConfig.db).toBeDefined();
  });
});
