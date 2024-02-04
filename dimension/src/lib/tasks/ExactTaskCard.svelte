<script lang="ts">
  import type { ExactTask } from './types';

  export let task: ExactTask;

  $: label = `There must be exactly ${task.amount} ${task.color}!`;
</script>

<div class="task exact-task" aria-label={label} title={label}>
  <div class="sphere {task.color}"></div>
  <span class="task-amount">{task.amount}</span>
</div>

<style>
  .exact-task {
    grid-template: 1fr / 1fr;
  }

  .sphere,
  .task-amount {
    grid-area: 1 / 1;
  }
</style>
