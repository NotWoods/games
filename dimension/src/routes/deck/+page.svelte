<script lang="ts">
  import TaskCard from '$lib/tasks/TaskCard.svelte';
  import { ALL_CARDS } from '$lib/tasks/deck';
</script>

<ul>
  {#each ALL_CARDS as task}
    <li>
      <TaskCard {task} />
    </li>
  {/each}
</ul>

<style>
  ul {
    padding: 0;
    display: grid;
    list-style: none;
    gap: 16px;
    grid-template-columns: repeat(12, minmax(100px, 1fr));
  }
</style>
