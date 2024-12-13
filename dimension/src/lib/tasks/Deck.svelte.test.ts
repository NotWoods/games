import { expect, test } from 'vitest';
import { Deck } from './Deck.svelte';

test.each([6, 8])('draw removes %s cards', (handSize) => {
  const deck = new Deck(undefined, handSize);

  expect(deck.cards).toHaveLength(60 - handSize);
  expect(deck.hand).toHaveLength(handSize);

  deck.draw();

  const firstHand = deck.hand;
  expect(deck.cards).toHaveLength(60 - handSize * 2);
  expect(firstHand).toHaveLength(handSize);

  deck.draw();

  expect(deck.cards).toHaveLength(60 - handSize * 3);
  expect(deck.hand).toHaveLength(handSize);
  expect(deck.hand).not.toEqual(firstHand);
});

test.each([6, 8])('shuffle resets deck', (handSize) => {
  const deck = new Deck(undefined, handSize);

  expect(deck.cards).toHaveLength(60 - handSize);
  expect(deck.hand).toHaveLength(handSize);

  deck.draw();
  deck.draw();
  deck.draw();

  expect(deck.cards).toHaveLength(60 - handSize * 4);

  deck.shuffle();

  expect(deck.cards).toHaveLength(60 - handSize);
  expect(deck.hand).toHaveLength(handSize);
});
