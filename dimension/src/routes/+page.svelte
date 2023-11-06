<script lang="ts">
  import TaskChecks from '$lib/tasks/TaskChecks.svelte';
  import { buildDeck } from '$lib/tasks/deck';
  import { onMount } from 'svelte';
  import '../app.css';

  const demoTasks: import('$lib/tasks/types').Task[] = [
    { type: 'touch', colorA: 'orange', colorB: 'green' },
    { type: 'not-touch', colorA: 'orange', colorB: 'green' },
    { type: 'exact', color: 'orange', amount: 2 },
    { type: 'not-over', color: 'orange' },
    { type: 'not-under', color: 'orange' },
    { type: 'more', colorA: 'orange', colorB: 'black' },
    { type: 'sum', colorA: 'orange', colorB: 'blue', amount: 4 },
  ];
  const { hand, deck, draw, shuffle } = buildDeck(demoTasks);

  onMount(() => {
    shuffle();
  });
</script>

<span>{$deck.length} cards left in deck</span>
<button on:click={shuffle}>Shuffle all cards into deck</button>
<TaskChecks tasks={$hand} />
<button on:click={draw}>Draw</button>
