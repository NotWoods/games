import type { DisplayResult, PlayAudio } from '../main/push-from-worker';
import { GameState, Ray, SphericalPoint } from './level-record';
import { random } from './math';
import {
  cartesianToSpherical,
  raycastOnSphereToPoint,
  rayToPoint,
  sphericalInterpolate,
  sphericalToCartesian,
} from './radian-math';

export class GameLogic {
  readonly state: GameState;

  constructor(stageRadius: number) {
    this.state = new GameState(stageRadius);
  }

  randomAudioPoint(): SphericalPoint {
    return {
      theta: Math.PI / 6, // random(Math.PI / 6, (Math.PI / 2) - 0.15),
      phi: random(0, 2 * Math.PI),
    };
  }

  waitTime() {
    return 10_000;
  }

  handlePlayerClick(hand: Ray): DisplayResult {
    const { stageRadius } = this.state;

    // raycast hand onto sphere
    // fallback to some point in distance if player exits the game dome
    const pointCartesian =
      raycastOnSphereToPoint(hand, stageRadius) ||
      rayToPoint(hand, stageRadius);

    // go from raycast point to radian lat lng
    const pointSpherical = cartesianToSpherical(pointCartesian);

    // complete level
    const { audio } = this.state.completeLevel(pointSpherical);

    // return an arc
    const interpolate = sphericalInterpolate(pointSpherical, audio);
    return {
      type: 'display_result',
      pointerPosition: pointCartesian,
      arc: [pointSpherical, interpolate(0.5), audio].map((point) =>
        sphericalToCartesian(point, stageRadius)
      ) as DisplayResult['arc'],
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
