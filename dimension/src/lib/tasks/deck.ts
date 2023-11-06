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

export function buildDeck(initialCards: readonly Task[] = ALL_CARDS, handSize = 6): Deck {
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

const ALL_CARDS: readonly Task[] = [
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
];
