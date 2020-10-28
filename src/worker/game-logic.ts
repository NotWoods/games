import type { DisplayResult, PlayAudio } from "../main/push-from-worker";
import { GameState, Ray, SphericalPoint, timeout } from "./level-record";
import {
  sphericalInterpolate,
  cartesianToSpherical,
  sphericalToCartesian,
  raycastOnSphereToPoint,
} from "./radian-math";

declare var self: DedicatedWorkerGlobalScope;

export class GameLogic {

  readonly state: GameState;

  constructor(stageRadius: number) {
    this.state = new GameState(stageRadius);
  }

  randomAudioPoint(): SphericalPoint {
    return {
      polar: 0,
      azimuthal: 0,
    };
  }

  waitTime() {
    return 10_000;
  }

  handlePlayerClick(hand: Ray): DisplayResult {
    const { stageRadius } = this.state;
    // raycast hand onto sphere
    const pointCartesian = raycastOnSphereToPoint(hand, stageRadius);

    // go from raycast point to radian lat lng
    const pointSpherical = cartesianToSpherical(pointCartesian);

    // complete level
    const { audio } = this.state.completeLevel(pointSpherical);

    // return an arc
    const interpolate = sphericalInterpolate(pointSpherical, audio);
    return {
      type: "display_result",
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
      type: "play_audio",
      audioPosition: sphericalToCartesian(level.audio, this.state.stageRadius)
    };
  }
}

const game = new GameLogic(15);

self.onmessage = async (evt: MessageEvent) => {
  self.postMessage(game.handlePlayerClick(evt.data.hand));
  await timeout(game.waitTime());
  self.postMessage(game.newAudioPoint());
}
