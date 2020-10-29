import workerUrl from 'consts:workerUrl';
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

const worker = new Worker(workerUrl);

worker.onmessage = (evt) => {
  const data: PlayAudio | DisplayResult = evt.data;
  console.log(data);
}
