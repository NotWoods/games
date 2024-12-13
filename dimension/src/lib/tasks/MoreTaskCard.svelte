<script lang="ts">
  import type { MoreTask } from './types';

  interface Props {
    task: MoreTask;
  }

  let { task }: Props = $props();

  let label = $derived(`There must be more ${task.colorA} than ${task.colorB}!`);
</script>

<div class="task more-task" aria-label={label} title={label}>
  <svg viewBox="0 0 94 150">
    <circle class="sphere {task.colorA}" cx="26" cy="75" r="21" />
    <circle class="sphere {task.colorB}" cx="68" cy="75" r="21" />
    <use href="#symbol-more-than" />
  </svg>
</div>
