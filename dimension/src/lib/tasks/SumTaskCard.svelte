<script lang="ts">
  import type { SumTask } from './types';

  interface Props {
    task: SumTask;
  }

  let { task }: Props = $props();

  let label = $derived(`The sum of ${task.colorA} and ${task.colorB} must be exactly ${task.amount}!`);
</script>

<div class="task sum-task" aria-label={label} title={label}>
  <svg viewBox="0 0 94 150">
    <circle class="sphere {task.colorB} sum-half" cx="47" cy="75" r="40" />
    <circle
      class="sphere {task.colorA} sum-half"
      clip-path="url(#symbol-half)"
      cx="47"
      cy="75"
      r="40"
    />
    <text class="task-amount" x="47" y="97.5">{task.amount}</text>
  </svg>
</div>

<style>
  .sum-half {
    transform-origin: center;
    transform: rotate(15deg);
  }
</style>
