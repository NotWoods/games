import { Ray, SphericalPoint, Vector } from './level-record';
import {
  add,
  distanceSquared,
  dot,
  haversin,
  scale,
  subtract,
  ZERO,
} from './math';

/**
 * Find the point where the ray intersects with a sphere centered at the origin.
 * https://github.com/libgdx/libgdx/blob/9eba80c6694160c743e43d4c3a5d60a5bad06f30/gdx/src/com/badlogic/gdx/math/Intersector.java#L353
 */
export function raycastOnSphereToPoint(
  ray: Ray,
  sphereRadius: number
): Vector | undefined {
  const center = ZERO;
  const len = dot(ray.direction, subtract(center, ray.origin));
  // behind the ray
  if (len < 0) return undefined;
  const dst2 = distanceSquared(
    center,
    add(ray.origin, scale(len, ray.direction))
  );
  const r2 = sphereRadius * sphereRadius;
  if (dst2 > r2) return undefined;
  return rayToPoint(ray, len - Math.sqrt(r2 - dst2));
}

export function rayToPoint(ray: Ray, distance: number) {
  return add(ray.origin, scale(distance, ray.direction));
}

/**
 * Returns an interpolator function given two points.
 * The returned interpolator function takes a single argument t,
 * where t is a number ranging from 0 to 1;
 * a value of 0 returns the point `from`,
 * while a value of 1 returns the point `to`.
 * Intermediate values interpolate from between them along the great arc
 * that passes through both. If they are antipodes,
 * an arbitrary great arc is chosen.
 *
 * Taken from d3-geo and modified to use radians.
 */
export function sphericalInterpolate(from: SphericalPoint, to: SphericalPoint) {
  const x0 = from.phi;
  const y0 = from.theta;
  const x1 = to.phi;
  const y1 = to.theta;

  const cy0 = Math.cos(y0),
    sy0 = Math.sin(y0),
    cy1 = Math.cos(y1),
    sy1 = Math.sin(y1),
    kx0 = cy0 * Math.cos(x0),
    ky0 = cy0 * Math.sin(x0),
    kx1 = cy1 * Math.cos(x1),
    ky1 = cy1 * Math.sin(x1),
    d =
      2 *
      Math.asin(Math.sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
    k = Math.sin(d);

  if (d === 0) {
    function interpolate() {
      return from;
    }

    interpolate.distance = 0;
    return interpolate;
  } else {
    function interpolate(t: number): SphericalPoint {
      const B = Math.sin((t *= d)) / k,
        A = Math.sin(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;

      return {
        theta: Math.atan2(z, Math.sqrt(x * x + y * y)),
        phi: Math.atan2(y, x),
      };
    }

    interpolate.distance = d;
    return interpolate;
  }
}

export function cartesianToSpherical(vector: Vector): SphericalPoint {
  const polar = Math.atan(Math.sqrt(vector.x ** 2 + vector.z ** 2) / vector.y);
  if (polar === 0) {
    return { theta: 0, phi: 0 };
  }

  const azimuthal = Math.atan(vector.z / vector.x);
  return { theta: polar, phi: azimuthal };
}

export function sphericalToCartesian(
  point: SphericalPoint,
  sphereRadius: number
): Vector {
  const x = sphereRadius * Math.sin(point.theta) * Math.cos(point.phi);
  const z = sphereRadius * Math.sin(point.theta) * Math.sin(point.phi);
  const y = sphereRadius * Math.cos(point.theta);
  return { x, y, z };
}
