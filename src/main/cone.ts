import * as THREE from 'three';

const ANIMATION_LENGTH = 1;

export class IndicatorCone {
  readonly obj: THREE.Object3D;
  readonly mixer: THREE.AnimationMixer;

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
      depthTest: false
    });
    const coneInner = new THREE.Mesh(coneGeometry, coneMaterial);
    const cone = new THREE.Object3D();
    coneInner.position.set(0, 0, 0.5);
    cone.add(coneInner);
    cone.visible = false;
    this.obj = cone;

    this.mixer = new THREE.AnimationMixer(cone);
  }

  hide() {
    this.obj.visible = false;
    this.startTime = -1;
  }

  show(length: number, start: THREE.Vector3, end: THREE.Vector3) {
    this.startTime = this.mixer.time;
    this.targetLength = length;
    this.obj.position.copy(start);
    this.obj.lookAt(end);
    this.obj.scale.z = 0.01;
    this.obj.visible = true;
  }

  render() {
    if (this.startTime < 0) return;

    if (this.mixer.time > this.startTime + 1) {
      this.obj.scale.z = this.targetLength;
    } else {
      const timePassed = this.mixer.time - this.startTime;
      const percentagePassed = timePassed / ANIMATION_LENGTH;
      this.obj.scale.z = this.targetLength * percentagePassed;
    }
  }
}
