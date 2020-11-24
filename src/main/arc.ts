import * as THREE from 'three';

export function getPoints(
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const curve = new THREE.EllipseCurve(
    0,
    0,
    radius,
    radius,
    startAngle,
    endAngle,
    false,
    0
  );

  return curve.getPoints(50);
}

export class Arc {

  geometry: THREE.BufferGeometry;
  line: THREE.Line;
  radius: number

  constructor(sphereRadius: number, height: number) {
    const h = sphereRadius - height;
    const rSquared = (2 * h * sphereRadius) - (h ** 2);
    this.radius = Math.sqrt(rSquared);

    this.geometry = new THREE.BufferGeometry();
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    this.line = new THREE.Line(this.geometry, arcMaterial);
    this.line.lookAt(0, 1, 0);
    this.line.rotateX(Math.PI);
    this.line.position.y = height;

    this.reset();
  }

  reset() {
    this.geometry.setFromPoints(getPoints(this.radius, 0, 2 * Math.PI));
  }

  set(startAngle: number, endAngle: number) {
    this.geometry.setFromPoints(getPoints(this.radius, startAngle, endAngle));
  }
}
