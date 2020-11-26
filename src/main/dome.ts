import * as THREE from 'three';

const ANIMATION_LENGTH = 5;

export class Dome {
  readonly obj: THREE.Object3D;
  readonly material: THREE.MeshBasicMaterial;
  readonly mixer: THREE.AnimationMixer;

  private startTime: number = -1;

  constructor(domeRadius: number) {
    const sphereGeometry = new THREE.SphereBufferGeometry(
      domeRadius,
      20,
      20,
      0,
      undefined,
      Math.PI / 2
    );
    sphereGeometry.rotateX(Math.PI);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
    });
    const dome = new THREE.Mesh(sphereGeometry, this.material);
    this.obj = dome;

    this.mixer = new THREE.AnimationMixer(dome);
  }

  fade() {
    if (this.startTime < 0) {
      this.startTime = this.mixer.time;
    }
  }

  render() {
    if (this.startTime < 0) return;

    if (this.mixer.time > this.startTime + ANIMATION_LENGTH) {
      this.material.opacity = 0;
    } else {
      const timePassed = this.mixer.time - this.startTime;
      const percentagePassed = timePassed / ANIMATION_LENGTH;
      this.material.opacity = 1 - percentagePassed;
    }
  }
}
