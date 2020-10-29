import { GameLogic } from './game-logic';
import { timeout } from './level-record';

declare var self: DedicatedWorkerGlobalScope;

const game = new GameLogic(15);

self.onmessage = async (evt: MessageEvent) => {
  self.postMessage(game.handlePlayerClick(evt.data.hand));
  await timeout(game.waitTime());
  self.postMessage(game.newAudioPoint());
};
