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
    /*if (this.audio.isPlaying) {
      this.audio.stop()
    }*/
    this.audio.play();
  }
}

export class SoundSphere {
  sound: Sound;
  mesh: THREE.LineSegments;

  constructor(listener: THREE.AudioListener, color: number) {
    this.sound = new Sound(listener);

    const sphere = new THREE.SphereBufferGeometry(0.25, 8, 6);
    const wireframe = new THREE.WireframeGeometry(sphere);
    this.mesh = new THREE.LineSegments(
      wireframe,
      new THREE.LineBasicMaterial({ color })
    );
    this.mesh.visible = false;
    this.mesh.add(this.sound.audio);
  }

  async load(url: string) {
    return this.sound.load(url);
  }

  play(x: number, y: number, z: number) {
    /*if (this.audio.isPlaying) {
      this.audio.stop()
    }*/
    this.mesh.position.set(x, y, z);
    this.sound.play();
  }
}
