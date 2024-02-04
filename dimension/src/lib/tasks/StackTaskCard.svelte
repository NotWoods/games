<script lang="ts">
  import type { StackTask } from './types';

  export let task: StackTask;

  $: label = `${task.color} must not be ${
    task.type === 'not-over' ? 'on top of' : 'underneath'
  } any spheres!`;

  $: topColor = task.type === 'not-over' ? task.color : 'rainbow';
  $: bottomColor = task.type === 'not-over' ? 'rainbow' : task.color;
</script>

<div class="task stack-task" aria-label={label} title={label}>
  <svg viewBox="0 0 94 150">
    <use href="#symbol-stack" />
    <circle class="sphere {topColor}" cx="47" cy="45" r="25" />
    <circle class="sphere {bottomColor}" cx="47" cy="105" r="25" />
    <use href="#symbol-cross" />
    <use href="#symbol-above" />
  </svg>
</div>
