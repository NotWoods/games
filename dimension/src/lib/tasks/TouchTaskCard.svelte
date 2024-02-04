<script lang="ts">
  import type { TouchTask } from './types';

  export let task: TouchTask;

  $: label = `${task.colorA} and ${task.colorB} ${task.type === 'touch' ? 'must' : 'must not'} touch!`;
</script>

<div class="task touch-task" aria-label={label} title={label}>
  <div class="sphere sphere-a {task.colorA}"></div>
  <div class="sphere sphere-b {task.colorB}"></div>
  <svg viewBox="0 0 94 150">
    {#if task.type === 'not-touch'}
      <use href="#symbol-cross" filter="url(#symbol-cross-shadow)" />
    {/if}
  </svg>
</div>

<style>
  .touch-task {
    grid-template: 1fr / 1fr;
  }

  .sphere {
    grid-area: 1 / 1;
  }
  .sphere-a {
    margin-block-start: 41cqmin;
    margin-inline-end: 41cqmin;
  }
  .sphere-b {
    margin-block-end: 41cqmin;
    margin-inline-start: 41cqmin;
  }
</style>
