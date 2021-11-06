import * as THREE from 'https://threejs.org/build/three.module.js';

const ANIMATION_LENGTH = 1;

export class IndicatorCone {
  private readonly scaled: THREE.Object3D;
  readonly obj: THREE.Object3D;
  readonly mixer: THREE.AnimationMixer;
  readonly endpoints: THREE.Material[] = [];

  private startTime: number = -1;
  private targetLength: number = 1;

  constructor() {
    const coneGeometry = new THREE.CylinderBufferGeometry(
      0.005,
      0.005,
      1,
      10,
      1,
      false
    );
    coneGeometry.rotateX(Math.PI / 2);
    const coneMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
    });
    const coneInner = new THREE.Mesh(coneGeometry, coneMaterial);
    coneInner.position.set(0, 0, 0.5);

    const scaled = new THREE.Object3D();
    scaled.add(coneInner);

    const cone = new THREE.Object3D();
    cone.add(scaled);
    cone.visible = false;

    this.scaled = scaled;
    this.obj = cone;

    this.mixer = new THREE.AnimationMixer(cone);
  }

  hide() {
    this.obj.visible = false;
    this.startTime = -1;
  }

  set length(value: number) {
    this.scaled.scale.z = value;
  }

  show(length: number, start: THREE.Vector3, end: THREE.Vector3) {
    this.startTime = this.mixer.time;
    this.targetLength = length;
    this.obj.position.copy(start);
    this.obj.lookAt(end);
    this.length = 0.01;
    this.obj.visible = true;
    for (const endpoint of this.endpoints) {
      endpoint.opacity = 0;
    }
  }

  render() {
    if (this.startTime < 0) return;

    if (this.mixer.time > this.startTime + ANIMATION_LENGTH) {
      this.length = this.targetLength;
      for (const endpoint of this.endpoints) {
        endpoint.opacity = 1;
      }
    } else {
      const timePassed = this.mixer.time - this.startTime;
      const percentagePassed = timePassed / ANIMATION_LENGTH;
      this.length = this.targetLength * percentagePassed;
      for (const endpoint of this.endpoints) {
        endpoint.opacity = percentagePassed;
      }
    }
  }
}
