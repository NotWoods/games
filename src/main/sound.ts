import * as THREE from 'three';

const audioLoader = new THREE.AudioLoader();

export class Sound {
  audio: THREE.PositionalAudio;

  constructor(listener: THREE.AudioListener) {
    this.audio = new THREE.PositionalAudio(listener);
  }

  async load(url: string) {
    const buffer: AudioBuffer = await audioLoader.loadAsync(url);
    this.audio.setBuffer(buffer);
  }

  play() {
    if (this.audio.isPlaying) {
      this.audio.stop();
      this.audio.isPlaying = false;
    }
    this.audio.play();
  }
}

export class Sphere {
  material: THREE.MeshLambertMaterial;
  mesh: THREE.Mesh;

  debug = false;
  visible = false;

  constructor(radius: number) {
    const geometry = new THREE.SphereBufferGeometry(radius, 8, 6);
    this.material = new THREE.MeshLambertMaterial({
      color: 0x404444,
      emissive: 0x898989,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  render() {
    this.material.wireframe = this.debug;
    this.mesh.visible = this.visible || this.debug;
  }
}
