<script lang="ts">
  import type { StackTask } from './types';

  export let task: StackTask;

  $: label = `${task.color} must not be ${
    task.type === 'not-over' ? 'on top of' : 'underneath'
  } any spheres!`;
</script>

<div class="task stack-task" aria-label={label} title={label}>
  <div class="sphere sphere-a {task.color}"></div>
  <div class="sphere sphere-b rainbow"></div>
  <div class="not-x">X</div>
  <span class="task-amount">⬇</span>
</div>

<style>
  .stack-task {
    grid-template: 1fr 1fr / auto;
  }
  .stack-task::before {
    content: '';
    position: absolute;
    display: block;
    inset: 0;
    width: 0;
    height: 0;
    margin: auto;
    border-inline: 50cqi solid transparent;
    border-bottom: 100cqb solid rgb(255 255 255 / 0.3);
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
  .not-x, .task-amount {
    z-index: 2;
    grid-row: 1 / -1;
    grid-column: 1;
  }
</style>
