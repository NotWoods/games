import * as THREE from 'three';
import type { OutOfTime, PlayerClick, StartGame } from '../worker';
import type { Vector } from '../worker/level-record';
import Worker from '../worker/index?worker';
import { ControllerManager } from './controller';

export interface PlayAudioMessage {
  type: 'play_audio';
  audioPosition: Vector;
  maxTime: number;
}

export interface PlayAudio {
  audioPosition: THREE.Vector3;
  maxTime: number;
}

export interface DisplayResultMessage {
  type: 'display_result';
  pointerPosition?: Vector;
  line?: {
    length: number;
    end: Vector;
  };
  score: number;
  goodGuess: boolean;
}

export interface DisplayResult {
  pointerPosition?: THREE.Vector3;
  line?: {
    length: number;
    end: THREE.Vector3;
  };
  score: number;
  goodGuess: boolean;
}

const ray = new THREE.Ray();
const tempMatrix = new THREE.Matrix4();

function toThreeVector(workerVector: Vector) {
  const { x, y, z } = workerVector;
  return new THREE.Vector3(x, y, z);
}

function fromThreeVector(threeVector: THREE.Vector3): Vector {
  return {
    x: threeVector.x,
    y: threeVector.y,
    z: threeVector.z,
  };
}

export class WorkerThread {
  private readonly worker = new Worker();
  onPlayAudio?: (data: PlayAudio) => void;
  onDisplayResult?: (data: DisplayResult) => void;

  constructor(private readonly raycaster: THREE.Raycaster) {
    this.worker.onmessage = (evt) => {
      const data = evt.data as PlayAudioMessage | DisplayResultMessage;
      console.log(data);
      switch (data.type) {
        case 'play_audio':
          return this.onPlayAudio?.({
            audioPosition: toThreeVector(data.audioPosition),
            maxTime: data.maxTime,
          });

        case 'display_result': {
          return this.onDisplayResult?.({
            pointerPosition:
              data.pointerPosition && toThreeVector(data.pointerPosition),
            line: data.line && {
              length: data.line.length,
              end: toThreeVector(data.line.end),
            },
            score: data.score,
            goodGuess: data.goodGuess,
          });
        }
      }
    };
  }

  sendPlayerClick(controller: ControllerManager, dome: THREE.Object3D[]) {
    tempMatrix.identity().extractRotation(controller.controller.matrixWorld);
    ray.origin.setFromMatrixPosition(controller.controller.matrixWorld);
    ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    ray.direction.normalize();

    this.raycaster.set(ray.origin, ray.direction);

    const [{ point }] = this.raycaster.intersectObjects(dome);
    const message: PlayerClick = {
      type: 'player_click',
      hand: fromThreeVector(point),
    };
    console.log(message);
    this.worker.postMessage(message);
  }

  sendOutOfTime() {
    const message: OutOfTime = { type: 'out_of_time' };
    console.log(message);
    this.worker.postMessage(message);
  }

  start() {
    const message: StartGame = { type: 'start_game' };
    console.log(message);
    this.worker.postMessage(message);
  }
}
