import domeRadius from 'consts:radius';
import { GameLogic } from './game-logic';

declare var self: DedicatedWorkerGlobalScope;

const game = new GameLogic(domeRadius);

self.onmessage = async (evt: MessageEvent) => {
  self.postMessage(game.handlePlayerClick(evt.data.hand));
};

setInterval(() => {
  self.postMessage(game.newAudioPoint());
}, 9000);
