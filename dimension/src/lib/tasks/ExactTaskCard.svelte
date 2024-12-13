<script lang="ts">
  import type { ExactTask } from './types';

  interface Props {
    task: ExactTask;
  }

  let { task }: Props = $props();

  let label = $derived(`There must be exactly ${task.amount} ${task.color}!`);
</script>

<div class="task exact-task" aria-label={label} title={label}>
  <svg viewBox="0 0 94 150">
    <circle class="sphere {task.color}" cx="47" cy="75" r="40" />
    <text class="task-amount" x="47" y="97">{task.amount}</text>
  </svg>
</div>
