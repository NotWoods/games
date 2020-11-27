import * as THREE from 'three';
import workerUrl from 'consts:workerUrl';
import type { Vector } from '../worker/level-record';
import { ControllerManager } from './controller';

export interface PlayAudio {
  type: 'play_audio';
  audioPosition: Vector;
}

export interface DisplayResult {
  type: 'display_result';
  pointerPosition?: Vector;
  line?: {
    length: number;
    end: Vector;
  };
  score: number;
  goodGuess: boolean;
}

const ray = new THREE.Ray();
const tempMatrix = new THREE.Matrix4();

export function toThreeVector(workerVector: Vector) {
  const { x, y, z } = workerVector;
  return new THREE.Vector3(x, y, z);
}

export function fromThreeVector(threeVector: THREE.Vector3): Vector {
  return {
    x: threeVector.x,
    y: threeVector.y,
    z: threeVector.z,
  };
}

export class WorkerThread {
  private readonly worker = new Worker(workerUrl);
  onMessage?: (data: PlayAudio | DisplayResult) => void;

  constructor(private readonly raycaster: THREE.Raycaster) {
    this.worker.onmessage = (evt) => {
      console.log(evt.data);
      this.onMessage?.(evt.data);
    };
  }

  sendPlayerClick(controller: ControllerManager, dome: THREE.Object3D[]) {
    tempMatrix.identity().extractRotation(controller.controller.matrixWorld);
    ray.origin.setFromMatrixPosition(controller.controller.matrixWorld);
    ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    ray.direction.normalize();

    this.raycaster.set(ray.origin, ray.direction);

    const [{ point }] = this.raycaster.intersectObjects(dome);
    const message = {
      hand: fromThreeVector(point),
    };
    console.log(message);
    this.worker.postMessage(message);
  }

  start() {
    this.worker.postMessage({});
  }
}
