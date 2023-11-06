<script lang="ts">
  import type { SumTask } from './types';

  export let task: SumTask;

  $: label = `The sum of ${task.colorA} and ${task.colorB} must be exactly ${task.amount}!`;
</script>

<div
  class="task sum-task"
  aria-label={label}
  title={label}
>
  <div class="sphere sphere-a {task.colorA} sum-half"></div>
  <div class="sphere sphere-b {task.colorB} sum-half"></div>
  <span class="task-amount">{task.amount}</span>
</div>

<style>
  .sum-task {
    grid-template: 1fr / 1fr;
  }

  .sum-half {
    transform: rotate(15deg);
    grid-area: 1 / 1;
  }
  .sum-half.sphere-b {
    clip-path: inset(0 0 0 50%);
  }

  .task-amount {
    grid-area: 1 / 1;
  }
</style>
