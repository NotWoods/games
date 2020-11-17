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
