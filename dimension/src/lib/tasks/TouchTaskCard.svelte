<script lang="ts">
  import type { TouchTask } from './types';

  export let task: TouchTask;

  $: label = `${task.colorA} and ${task.colorB} ${task.type === 'touch' ? 'must' : 'must not'} touch!`;
</script>

<div class="task touch-task" aria-label={label} title={label}>
  <svg viewBox="0 0 94 150">
    <circle class="sphere {task.colorA}" cx="28" cy="91" r="24" />
    <circle class="sphere {task.colorB}" cx="64" cy="59" r="24" />
    {#if task.type === 'not-touch'}
      <use href="#symbol-cross" filter="url(#symbol-cross-shadow)" />
    {/if}
  </svg>
</div>
