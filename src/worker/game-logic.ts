import type { DisplayResult, PlayAudio } from '../main/push-from-worker';
import { GameState, SphericalPoint, Vector } from './level-record';
import { random } from './math';
import {
  cartesianToSpherical,
  positiveRadian,
  sphericalToCartesian,
} from './radian-math';

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
      this.state.completeLevel(undefined)
      return {
        type: 'display_result',
        pointerPosition: undefined,
        arcCurve: undefined,
        goodGuess: false
      }
    }

    // go from raycast point to radian lat lng
    const pointSpherical = cartesianToSpherical(pointerPosition);

    // complete level
    const { audio } = this.state.completeLevel(pointSpherical);

    const height = stageRadius / 4;
    const h = stageRadius - height;
    const rSquared = (2 * h * stageRadius) - (h ** 2);

    const startAngle = positiveRadian(pointSpherical.phi);
    const endAngle = positiveRadian(audio.phi);

    const GOOD_GUESS_THRESHOLD = 1;

    return {
      type: 'display_result',
      pointerPosition,
      arcCurve: {
        height,
        radius: Math.sqrt(rSquared),
        startAngle,
        endAngle,
      },
      goodGuess: positiveRadian(endAngle - startAngle) < GOOD_GUESS_THRESHOLD
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
