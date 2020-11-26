import * as THREE from 'three';

export class Sphere {
  outlineMaterial: THREE.MeshBasicMaterial;
  outlineMesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;

  private _debug = false;
  private _visible = false;

  constructor(radius: number, outlineColor: number) {
    const geometry = new THREE.SphereBufferGeometry(radius, 12, 10);

    this.outlineMaterial = new THREE.MeshBasicMaterial({
      color: outlineColor,
      side: THREE.BackSide,
    });
    const beepOutline = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.08, 12, 10),
      this.outlineMaterial
    );
    beepOutline.scale.multiplyScalar(1.1);
    beepOutline.visible = false;
    this.outlineMesh = beepOutline;

    this.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.visible = false;
  }

  addToGroup(group: THREE.Object3D) {
    group.add(this.outlineMesh);
    group.add(this.mesh);
  }

  setPosition(position: THREE.Vector3) {
    this.mesh.position.copy(position)
    this.outlineMesh.position.copy(position)
  }

  set debug(value: boolean) {
    this._debug = value;
    this.material.wireframe = value;
    this.render();
  }

  set visible(value: boolean) {
    this._visible = value;
    this.render();
  }

  private render() {
    this.outlineMesh.visible = this._visible || this._debug;
    this.mesh.visible = this._visible || this._debug;
  }
}
