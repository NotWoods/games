<script lang="ts">
  import TaskCard from './TaskCard.svelte';
  import TaskCheck from './TaskCheck.svelte';
  import type { Task } from './types';

  interface Props {
    tasks: readonly Task[];
  }

  let { tasks }: Props = $props();
</script>

<ul style="--total-tasks: {tasks.length}">
  {#each tasks as task, index}
    <li>
      <TaskCheck value="task-{index}">
        <TaskCard {task} />
      </TaskCheck>
    </li>
  {/each}
</ul>

<style>
  ul {
    --columns: 3;
    display: grid;
    list-style: none;
    grid-template-columns: repeat(var(--columns), 2fr);
    grid-template-rows: repeat(calc(var(--total-tasks) / var(--columns)), 3fr);
    gap: 16px;
    max-inline-size: 1200px;
    padding: 0;
    margin-inline: auto;
  }

  @media (min-width: 650px) {
    ul {
      --columns: var(--total-tasks);
    }
  }
</style>
