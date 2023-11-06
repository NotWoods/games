<script lang="ts">
  import TaskChecks from '$lib/tasks/TaskChecks.svelte';
  import { buildDeck } from '$lib/tasks/deck';
  import { onMount } from 'svelte';
  import '../app.css';

  let keyClear = 0;
  const { hand, deck, draw, shuffle } = buildDeck();

  $: {
    $hand;
    keyClear++;
  }

  onMount(() => {
    shuffle();
  });
</script>

<span>{$deck.length} cards left in deck</span>
<button on:click={shuffle}>Shuffle all cards into deck</button>
{#key keyClear}
  <TaskChecks tasks={$hand} />
{/key}
<button on:click={draw}>Draw</button>
