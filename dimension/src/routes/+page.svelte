<script lang="ts">
  import TaskChecks from '$lib/tasks/TaskChecks.svelte';
  import { buildDeck } from '$lib/tasks/deck';
  import { onMount } from 'svelte';
  import { ChangeCount } from '$lib/tasks/ChangeCount.svelte';

  const { hand, deck, draw, shuffle } = buildDeck();

  const keyClear = new ChangeCount(() => hand)

  onMount(() => {
    shuffle();
  });
</script>

<span>{$deck.length} cards left in deck</span>
<button onclick={shuffle}>Shuffle all cards into deck</button>
{#key keyClear.key}
  <TaskChecks tasks={$hand} />
{/key}
<button onclick={draw}>Draw</button>
