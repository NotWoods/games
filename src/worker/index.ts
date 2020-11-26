import domeRadius from 'consts:radius';
import { GameLogic } from './game-logic';
import { timeout } from './level-record';

declare var self: DedicatedWorkerGlobalScope;

const game = new GameLogic(domeRadius);
let started = false;

self.onmessage = async (evt: MessageEvent) => {
  const { hand } = evt.data;
  if (started || hand) {
    self.postMessage(game.handlePlayerClick(evt.data.hand));
    await timeout(4000);
  } else {
    started = true;
    await timeout(1000);
  }
  self.postMessage(game.newAudioPoint());
};

// self.postMessage(game.newAudioPoint());
