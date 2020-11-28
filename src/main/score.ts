import * as THREE from 'three';

const loader = new THREE.FontLoader();

export class Score {
  private readonly material = new THREE.MeshBasicMaterial({
    color: 0x111111,
    side: THREE.FrontSide,
  });
  private font: THREE.Font | undefined;
  private mesh: THREE.Mesh | undefined;

  readonly ready: Promise<void>;
  readonly group: THREE.Group;

  constructor() {
    this.ready = this.load();
    this.group = new THREE.Group();
    this.group.position.y = 0.01;
    this.group.rotateX(-Math.PI / 2);
  }

  async load() {
    this.font = await loader.loadAsync(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'
    );
  }

  async setScore(value: string) {
    await this.ready;
    const geometry = new THREE.TextGeometry(value, {
      font: this.font!,
      size: 0.5,
      height: 0,
      curveSegments: 12,
    });

    const mesh = new THREE.Mesh(geometry, this.material);
    if (this.mesh) {
      this.group.remove(this.mesh);
    }
    this.group.add(mesh);
    this.mesh = mesh;
  }
}
