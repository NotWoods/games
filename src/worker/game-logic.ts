import type { DisplayResult, PlayAudio } from '../main/push-from-worker';
import { GameState, Ray, SphericalPoint, Vector } from './level-record';
import { random } from './math';
import {
  cartesianToSpherical,
  raycastOnSphereToPoint,
  rayToPoint,
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

  raycast(hand: Ray): Vector {
    const { stageRadius } = this.state;

    // raycast hand onto sphere
    // fallback to some point in distance if player exits the game dome
    const pointCartesian =
      raycastOnSphereToPoint(hand, stageRadius) ||
      rayToPoint(hand, stageRadius);

    return pointCartesian;
  }

  handlePlayerClick(hand: Ray): DisplayResult {
    const { stageRadius } = this.state;

    // raycast hand onto sphere
    // fallback to some point in distance if player exits the game dome
    const pointCartesian = raycastOnSphereToPoint(hand, stageRadius);

    // go from raycast point to radian lat lng
    const pointSpherical = cartesianToSpherical(
      pointCartesian || rayToPoint(hand, stageRadius)
    );

    // complete level
    const { audio } = this.state.completeLevel(pointSpherical);

    const height = stageRadius / 2;
    const h = stageRadius - height;
    const rSquared = (2 * h * stageRadius) - (h ** 2);

    return {
      type: 'display_result',
      pointerPosition: sphericalToCartesian(pointSpherical, stageRadius),
      arc: [
        sphericalToCartesian(pointSpherical, stageRadius),
        sphericalToCartesian(audio, stageRadius),
      ] as DisplayResult['arc'],
      arcCurve: {
        height,
        radius: Math.sqrt(rSquared),
        startAngle: pointSpherical.phi,
        endAngle: audio.phi,
      }
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
