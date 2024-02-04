<script lang="ts">
  import type { StackTask } from './types';

  export let task: StackTask;

  $: label = `${task.color} must not be ${
    task.type === 'not-over' ? 'on top of' : 'underneath'
  } any spheres!`;
</script>

<div class="task stack-task" aria-label={label} title={label}>
  <svg viewBox="0 0 94 150">
    <use href="#symbol-stack" />
    <circle class="sphere {task.color}" cx="47" cy="45" r="25" />
    <circle class="sphere rainbow" fill="url(#rainbow-gradient)" cx="47" cy="105" r="25" />
    <use href="#symbol-cross" />
    <use href="#symbol-above" />
  </svg>
</div>

<style>
  .stack-task {
    grid-template: 1fr 1fr / auto;
  }

  .sphere {
    z-index: 1;
    grid-column: 1;
  }
  .sphere-a {
    grid-row: 1;
  }
  .sphere-b {
    grid-row: 2;
  }
</style>
