import type { DisplayResult, PlayAudio } from '../main/push-from-worker';
import { GameState, SphericalPoint, Vector } from './level-record';
import { random } from './math';
import { cartesianToSpherical, sphericalToCartesian } from './radian-math';

export class GameLogic {
  readonly state: GameState;

  constructor(stageRadius: number) {
    this.state = new GameState(stageRadius);
  }

  randomAudioPoint(): SphericalPoint {
    return {
      theta: random(Math.PI / 6, Math.PI / 2 - 0.15),
      phi: random(0, 2 * Math.PI),
    };
  }

  waitTime() {
    return 10_000;
  }

  handlePlayerClick(pointerPosition: Vector | undefined): DisplayResult {
    const { stageRadius } = this.state;

    if (!pointerPosition) {
      this.state.completeLevel(undefined);
      return {
        type: 'display_result',
        pointerPosition: undefined,
        score: this.state.totalScore(),
        goodGuess: false,
      };
    }

    // go from raycast point to radian lat lng
    const pointSpherical = cartesianToSpherical(pointerPosition);

    // complete level
    const { audio, score } = this.state.completeLevel(pointSpherical);

    const end = sphericalToCartesian(audio, stageRadius);

    return {
      type: 'display_result',
      pointerPosition,
      line: {
        length: Math.sqrt(score),
        end,
      },
      score: this.state.totalScore(),
      goodGuess: this.state.goodScore(score),
    };
  }

  newAudioPoint(): PlayAudio {
    // send a new audio sound
    const level = this.state.startLevel(this.randomAudioPoint());
    return {
      type: 'play_audio',
      audioPosition: sphericalToCartesian(level.audio, this.state.stageRadius),
    };
  }
}
