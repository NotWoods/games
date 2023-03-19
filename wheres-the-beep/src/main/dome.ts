import * as THREE from 'three';

export class Dome {
  readonly obj: THREE.Object3D;
  readonly material: THREE.MeshBasicMaterial;
  readonly mixer: THREE.AnimationMixer;

  constructor(domeRadius: number) {
    const sphereGeometry = new THREE.SphereBufferGeometry(
      domeRadius,
      20,
      20,
      0,
      undefined,
      Math.PI / 2,
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
}
