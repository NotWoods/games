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
