import type { DisplayResult, PlayAudio } from '../main/push-from-worker';
import { GameState, SphericalPoint, Vector } from './level-record';
import { distanceSquared, random } from './math';
import { cartesianToSpherical, sphericalToCartesian } from './radian-math';

const GOOD_SCORE_THRESHOLD = 2.5 ** 2;

export class GameLogic {
  readonly state: GameState;
  score = 0;

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
      this.score = 0;
      return {
        type: 'display_result',
        pointerPosition: undefined,
        score: this.score,
        goodGuess: false,
      };
    }

    // go from raycast point to radian lat lng
    const pointSpherical = cartesianToSpherical(pointerPosition);

    // complete level
    const { audio } = this.state.completeLevel(pointSpherical);

    const end = sphericalToCartesian(audio, stageRadius);

    const distSq = distanceSquared(pointerPosition, end);
    const goodGuess = distSq <= GOOD_SCORE_THRESHOLD;

    if (goodGuess) {
      this.score++;
    } else {
      this.score = 0;
    }

    return {
      type: 'display_result',
      pointerPosition,
      line: {
        length: Math.sqrt(distSq),
        end,
      },
      score: this.score,
      goodGuess,
    };
  }

  newAudioPoint(): PlayAudio {
    // send a new audio sound
    const level = this.state.startLevel(this.randomAudioPoint());
    return {
      type: 'play_audio',
      audioPosition: sphericalToCartesian(level.audio, this.state.stageRadius),
      maxTime: 15,
    };
  }
}
