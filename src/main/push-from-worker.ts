import type { Vector } from '../worker/level-record';

export interface PlayAudio {
  type: 'play_audio';
  audioPosition: Vector;
}

export interface DisplayResult {
  type: 'display_result';
  pointerPosition: Vector;
  arc: [Vector, Vector, Vector];
}
