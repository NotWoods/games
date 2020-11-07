import domeRadius from 'consts:radius'
import { GameLogic } from './game-logic';
import { timeout } from './level-record';
import { sphericalToCartesian } from './radian-math';

declare var self: DedicatedWorkerGlobalScope;

const game = new GameLogic(domeRadius);

self.onmessage = async (evt: MessageEvent) => {
  self.postMessage(game.handlePlayerClick(evt.data.hand));
  await timeout(game.waitTime());
  self.postMessage(game.newAudioPoint());
};

setInterval(() =>  {
  const point = game.randomAudioPoint()
  self.postMessage({
    type: 'play_audio',
    audioPosition: sphericalToCartesian(point, game.state.stageRadius),
  })
}, 5000)
