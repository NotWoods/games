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

export class WorkerThread {
  private readonly worker = new Worker(workerUrl);

  set onmessage(value: (evt: MessageEvent<PlayAudio | DisplayResult>) => void) {
    this.worker.onmessage = value;
  }
}
