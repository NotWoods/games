import { untrack } from 'svelte';

/**
 * Updates whenever a tracked value changes.
 */
export class ChangeCount {
  #count = $state(0);

  constructor(watcher: () => unknown) {
    $effect.pre(() => {
      watcher();
      this.#count = untrack(() => this.#count + 1);
    });
  }

  get key() {
    return this.#count;
  }
}
