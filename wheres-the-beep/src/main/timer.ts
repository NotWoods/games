import * as THREE from 'three';

function clamp(n: number, min: number, max: number) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export class Timer extends THREE.EventDispatcher {
  private readonly curve: THREE.EllipseCurve;
  private readonly geometry: THREE.BufferGeometry;
  readonly line: THREE.Line;

  private maxTime = 15;
  private timePassed = 0;
  private outOfTime = false;
  paused = true;

  constructor(radius: number) {
    super();
    this.curve = new THREE.EllipseCurve(
      0,
      0,
      radius - 0.1,
      radius - 0.1,
      0,
      Math.PI * 2,
      false,
      -Math.PI / 2,
    );
    this.geometry = new THREE.BufferGeometry();

    const material = new THREE.LineBasicMaterial({ color: 0x111111 });
    const line = new THREE.Line(this.geometry, material);
    line.lookAt(0, 1, 0);
    line.rotateX(Math.PI);
    line.position.y = 0.01;
    this.line = line;
    this.progress(0);
  }

  private progress(percent: number) {
    const percentage = 1 - clamp(percent, 0, 1);
    if (percentage === 0 && !this.outOfTime) {
      this.outOfTime = true;
      this.dispatchEvent({ type: 'out_of_time' });
    }

    this.curve.aEndAngle = Math.PI * 2 * percentage;
    this.geometry.setFromPoints(this.curve.getPoints(50));
  }

  reset(maxTime: number) {
    this.maxTime = maxTime;
    this.timePassed = -1;
    this.paused = false;
    this.outOfTime = false;
    this.progress(0);
  }

  update(deltaTime: number) {
    if (!this.paused) {
      this.timePassed += deltaTime;
      this.progress(this.timePassed / this.maxTime);
    }
  }
}
