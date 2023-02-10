import { domeRadius } from '../consts.js';
import { GameLogic } from './game-logic.js';
import { timeout, Vector } from './level-record.js';

declare var self: DedicatedWorkerGlobalScope;

const game = new GameLogic(domeRadius);

export interface StartGame {
  type: 'start_game';
}

export interface PlayerClick {
  type: 'player_click';
  hand: Vector;
}

export interface OutOfTime {
  type: 'out_of_time';
}

self.onmessage = async (
  evt: MessageEvent<StartGame | PlayerClick | OutOfTime>
) => {
  switch (evt.data.type) {
    case 'start_game':
      await timeout(1000);
      self.postMessage(game.newAudioPoint());
      break;
    case 'player_click': {
      const { hand } = evt.data;
      self.postMessage(game.handlePlayerClick(hand));
      await timeout(4000);
      self.postMessage(game.newAudioPoint());
      break;
    }
    case 'out_of_time':
      self.postMessage(game.handlePlayerClick(undefined));
      await timeout(4000);
      self.postMessage(game.newAudioPoint());
      break;
  }
};
