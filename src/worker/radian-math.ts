import { Ray, SphericalPoint, Vector } from "./level-record";
import { add, dot, haversin, scale } from "./math";

/**
 * Find the point where the ray intersects with a sphere centered at the origin.
 * http://viclw17.github.io/2018/07/16/raytracing-ray-sphere-intersection/
 */
export function raycastOnSphere(ray: Ray, sphereRadius: number): number {
  // sphere's origin is 0, 0, 0
  const oc = ray.origin;
  const a = dot(ray.direction, ray.direction);
  const b = 2 * dot(oc, ray.direction);
  const c = dot(oc, oc) - sphereRadius * sphereRadius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return -1;
  } else {
    return (-b - Math.sqrt(discriminant)) / (2 * a);
  }
}

export function raycastOnSphereToPoint(ray: Ray, sphereRadius: number): Vector {
  const t = raycastOnSphere(ray, sphereRadius);
  return add(ray.origin, scale(t, ray.direction));
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
  const x0 = from.azimuthal;
  const y0 = from.polar;
  const x1 = to.azimuthal;
  const y1 = to.polar;

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
    function interpolate(t: number) {
      const B = Math.sin((t *= d)) / k,
        A = Math.sin(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;

      return {
        polar: Math.atan2(z, Math.sqrt(x * x + y * y)),
        azimuthal: Math.atan2(y, x),
      };
    }

    interpolate.distance = d;
    return interpolate;
  }
}

export function cartesianToSpherical(vector: Vector): SphericalPoint {
  const polar = Math.atan(Math.sqrt(vector.x ** 2 + vector.z ** 2) / vector.y);
  if (polar === 0) {
    return { polar: 0, azimuthal: 0 }
  }

  const azimuthal = Math.atan(vector.z / vector.x);
  return { polar, azimuthal };
}

export function sphericalToCartesian(
  point: SphericalPoint,
  sphereRadius: number
): Vector {
  const x = sphereRadius * Math.sin(point.polar) * Math.cos(point.azimuthal);
  const z = sphereRadius * Math.sin(point.polar) * Math.sin(point.azimuthal);
  const y = sphereRadius * Math.cos(point.polar);
  return { x, y, z };
}
