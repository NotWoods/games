<script lang="ts">
  import ExactTaskCard from './ExactTaskCard.svelte';
  import MoreTaskCard from './MoreTaskCard.svelte';
  import StackTaskCard from './StackTaskCard.svelte';
  import SumTaskCard from './SumTaskCard.svelte';
  import TouchTaskCard from './TouchTaskCard.svelte';
  import type { Task } from './types';

  export let task: Task;
</script>

{#if task.type === 'touch' || task.type === 'not-touch'}
  <TouchTaskCard {task} />
{:else if task.type === 'exact'}
  <ExactTaskCard {task} />
{:else if task.type === 'sum'}
  <SumTaskCard {task} />
{:else if task.type === 'more'}
  <MoreTaskCard {task} />
{:else if task.type === 'not-over' || task.type === 'not-under'}
  <StackTaskCard {task} />
{/if}
