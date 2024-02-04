import arrayShuffle from 'array-shuffle';
import type { Task } from './types';
import { writable, type Readable } from 'svelte/store';

export interface Deck {
  /**
   * Current drawn cards. Will always be the first `handSize` cards of `deck`.
   */
  hand: Readable<readonly Task[]>;
  /**
   * Remaining cards in the deck.
   */
  deck: Readable<readonly Task[]>;
  /**
   * Draw a new hand of cards.
   */
  draw(): void;
  /**
   * Shuffle all cards back into the deck and draw a new hand of cards.
   */
  shuffle(): void;
}

export function buildDeck(
  initialCards: readonly Task[] = ALL_CARDS,
  handSize = 6,
): Deck {
  const cards = writable<readonly Task[]>([]);
  const hand = writable<readonly Task[]>([]);

  function draw() {
    cards.update((deck) => {
      if (deck.length === 0) return deck;

      const newHand = deck.slice(0, handSize);
      const newDeck = deck.slice(handSize);
      hand.set(newHand);
      return newDeck;
    });
  }

  function shuffle() {
    cards.set(arrayShuffle(initialCards));
    draw();
  }

  shuffle();

  return {
    hand,
    deck: cards,
    draw,
    shuffle,
  };
}

export const ALL_CARDS: readonly Task[] = [
  { type: 'touch', colorA: 'white', colorB: 'white' },
  { type: 'touch', colorA: 'white', colorB: 'black' },
  { type: 'touch', colorA: 'white', colorB: 'orange' },
  { type: 'touch', colorA: 'white', colorB: 'green' },
  { type: 'touch', colorA: 'white', colorB: 'blue' },
  { type: 'touch', colorA: 'orange', colorB: 'orange' },
  { type: 'touch', colorA: 'orange', colorB: 'green' },
  { type: 'touch', colorA: 'orange', colorB: 'black' },
  { type: 'touch', colorA: 'orange', colorB: 'blue' },
  { type: 'touch', colorA: 'green', colorB: 'blue' },
  { type: 'touch', colorA: 'green', colorB: 'black' },
  { type: 'touch', colorA: 'green', colorB: 'green' },
  { type: 'touch', colorA: 'black', colorB: 'blue' },
  { type: 'touch', colorA: 'black', colorB: 'black' },
  { type: 'touch', colorA: 'blue', colorB: 'blue' },
  { type: 'not-touch', colorA: 'white', colorB: 'white' },
  { type: 'not-touch', colorA: 'white', colorB: 'black' },
  { type: 'not-touch', colorA: 'white', colorB: 'orange' },
  { type: 'not-touch', colorA: 'white', colorB: 'green' },
  { type: 'not-touch', colorA: 'white', colorB: 'blue' },
  { type: 'not-touch', colorA: 'orange', colorB: 'orange' },
  { type: 'not-touch', colorA: 'orange', colorB: 'green' },
  { type: 'not-touch', colorA: 'orange', colorB: 'black' },
  { type: 'not-touch', colorA: 'orange', colorB: 'blue' },
  { type: 'not-touch', colorA: 'green', colorB: 'blue' },
  { type: 'not-touch', colorA: 'green', colorB: 'black' },
  { type: 'not-touch', colorA: 'green', colorB: 'green' },
  { type: 'not-touch', colorA: 'black', colorB: 'blue' },
  { type: 'not-touch', colorA: 'black', colorB: 'black' },
  { type: 'not-touch', colorA: 'blue', colorB: 'blue' },
  { type: 'sum', colorA: 'orange', colorB: 'blue', amount: 4 },
  { type: 'sum', colorA: 'blue', colorB: 'green', amount: 4 },
  { type: 'sum', colorA: 'white', colorB: 'orange', amount: 4 },
  { type: 'sum', colorA: 'green', colorB: 'black', amount: 4 },
  { type: 'sum', colorA: 'black', colorB: 'white', amount: 4 },
  { type: 'exact', color: 'blue', amount: 1 },
  { type: 'exact', color: 'blue', amount: 2 },
  { type: 'exact', color: 'black', amount: 1 },
  { type: 'exact', color: 'black', amount: 2 },
  { type: 'exact', color: 'orange', amount: 1 },
  { type: 'exact', color: 'orange', amount: 2 },
  { type: 'exact', color: 'green', amount: 1 },
  { type: 'exact', color: 'green', amount: 2 },
  { type: 'exact', color: 'white', amount: 1 },
  { type: 'exact', color: 'white', amount: 2 },
  { type: 'more', colorA: 'white', colorB: 'green' },
  { type: 'more', colorA: 'orange', colorB: 'black' },
  { type: 'more', colorA: 'green', colorB: 'orange' },
  { type: 'more', colorA: 'black', colorB: 'blue' },
  { type: 'more', colorA: 'blue', colorB: 'white' },
  { type: 'not-over', color: 'orange' },
  { type: 'not-over', color: 'blue' },
  { type: 'not-over', color: 'white' },
  { type: 'not-over', color: 'green' },
  { type: 'not-over', color: 'black' },
  { type: 'not-under', color: 'orange' },
  { type: 'not-under', color: 'blue' },
  { type: 'not-under', color: 'white' },
  { type: 'not-under', color: 'green' },
  { type: 'not-under', color: 'black' },
];
