import domeRadius from 'consts:radius';
import { GameLogic } from './game-logic';
import { timeout } from './level-record';

declare var self: DedicatedWorkerGlobalScope;

const game = new GameLogic(domeRadius);

self.onmessage = async (evt: MessageEvent) => {
  self.postMessage(game.handlePlayerClick(evt.data.hand));
  await timeout(2000);
  self.postMessage(game.newAudioPoint());
};

self.postMessage(game.newAudioPoint());
