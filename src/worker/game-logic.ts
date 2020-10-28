import type { DisplayResult, PlayAudio } from "../main/push-from-worker";
import { GameState, Ray } from "./level-record";
import {
  sphericalInterpolate,
  cartesianToSpherical,
  sphericalToCartesian,
  raycastOnSphere,
} from "./radian-math";

declare var self: DedicatedWorkerGlobalScope;

const game = new GameState(15);

function timeout(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Given player position and direction,
 * find the corresponding point on a sphere
 * and get the distance from that point to the audio source.
 *
 * Later send a new audio sound.
 */
async function onPlayerClick(data: { hand: Ray }) {
  // raycast hand onto sphere
  const pointCartesian = raycastOnSphere(data.hand, game.stageRadius);

  // go from raycast point to radian lat lng
  const pointSpherical = cartesianToSpherical(pointCartesian);

  // complete level
  const { audio } = game.completeLevel(pointSpherical);

  // return an arc
  const interpolate = sphericalInterpolate(pointSpherical, audio);
  const displayMessage: DisplayResult = {
    type: "display_result",
    pointerPosition: pointCartesian,
    arc: [pointSpherical, interpolate(0.5), audio].map((point) =>
      sphericalToCartesian(point, game.stageRadius)
    ) as DisplayResult['arc'],
  };
  self.postMessage(displayMessage);

  await timeout(game.waitTime());

  // send a new audio sound
  const level = game.startLevel();
  const audioMessage: PlayAudio = {
    type: "play_audio",
    audioPosition: sphericalToCartesian(level.audio, game.stageRadius),
  };
  self.postMessage(audioMessage);
}

self.onmessage = (evt) => onPlayerClick(evt.data);
