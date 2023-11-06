<script lang="ts">
  import type { MoreTask } from './types';

  export let task: MoreTask;

  $: label = `There must be more ${task.colorA} than ${task.colorB}!`;
</script>

<div
  class="task more-task"
  aria-label={label}
  title={label}
>
  <div class="sphere sphere-a {task.colorA}"></div>
  <div class="sphere sphere-b {task.colorB}"></div>
  <span class="task-amount">&gt;</span>
</div>

<style>
  .more-task {
    grid-template: auto / 1fr 1fr;
  }
  .task-amount {
    grid-row: 1;
    grid-column: 1 / -1;
  }
  .sphere {
    grid-row: 1;
  }
  .sphere-a {
    grid-column: 1;
  }
  .sphere-b {
    grid-column: 2;
  }
</style>
