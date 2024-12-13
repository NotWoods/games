<script lang="ts">
  import TaskChecks from '$lib/tasks/TaskChecks.svelte';
  import { Deck } from '$lib/tasks/Deck.svelte';
  import { onMount } from 'svelte';
  import { ChangeCount } from '$lib/tasks/ChangeCount.svelte';

  const deck = new Deck()

  const keyClear = new ChangeCount(() => deck.hand)

  onMount(() => {
    deck.shuffle();
  });
</script>

<span>{deck.cards.length} cards left in deck</span>
<button onclick={deck.shuffle}>Shuffle all cards into deck</button>
{#key keyClear.key}
  <TaskChecks tasks={deck.hand} />
{/key}
<button onclick={deck.draw}>Draw</button>
