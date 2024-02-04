import { expect, test } from 'vitest';
import { buildDeck } from './deck';
import { get } from 'svelte/store';

test.each([6, 8])('draw removes %s cards', (handSize) => {
  const deck = buildDeck(undefined, handSize);

  expect(get(deck.deck)).toHaveLength(60 - handSize);
  expect(get(deck.hand)).toHaveLength(handSize);

  deck.draw();

  const firstHand = get(deck.hand);
  expect(get(deck.deck)).toHaveLength(60 - handSize * 2);
  expect(firstHand).toHaveLength(handSize);

  deck.draw();

  expect(get(deck.deck)).toHaveLength(60 - handSize * 3);
  expect(get(deck.hand)).toHaveLength(handSize);
  expect(get(deck.hand)).not.toEqual(firstHand);
});

test.each([6, 8])('shuffle resets deck', (handSize) => {
  const deck = buildDeck(undefined, handSize);

  expect(get(deck.deck)).toHaveLength(60 - handSize);
  expect(get(deck.hand)).toHaveLength(handSize);

  deck.draw();
  deck.draw();
  deck.draw();

  expect(get(deck.deck)).toHaveLength(60 - handSize * 4);

  deck.shuffle();

  expect(get(deck.deck)).toHaveLength(60 - handSize);
  expect(get(deck.hand)).toHaveLength(handSize);
});
