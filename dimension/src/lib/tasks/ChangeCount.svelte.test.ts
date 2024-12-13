import { describe, expect, test } from 'vitest';
import { ChangeCount } from './ChangeCount.svelte';

describe('ChangeCount', () => {
  test('change increments count by 1', () => {
    const cleanup = $effect.root(() => {
      let state = $state('foo');
      const changeCount = new ChangeCount(() => state);
      expect(changeCount.key).toBe(0);

      state = 'bar';
      expect(changeCount.key).toBe(1);

      state = 'bar';
      expect(changeCount.key).toBe(1);
    });
    cleanup();
  });
});
