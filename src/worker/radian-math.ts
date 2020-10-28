import { Ray, SphericalPoint, Vector } from "./level-record";

/**
 * Taken from d3-geo.
 */
export function haversin(x: number) {
  return (x = Math.sin(x / 2)) * x;
}

/**
 * Find the point where the ray intersects with a sphere centered at the origin.
 */
export function raycastOnSphere(ray: Ray, sphereRadius: number): Vector {
  // sphere's origin is 0, 0, 0
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
    function interpolate(t: number) {
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
  const polar = Math.atan(Math.sqrt(vector.x ** 2 + vector.y ** 2) / vector.z);
  const azimuthal = Math.atan(vector.y / vector.x);
  return { polar, azimuthal };
}

export function sphericalToCartesian(
  point: SphericalPoint,
  radius: number
): Vector {
  const x = radius * Math.sin(point.polar) * Math.cos(point.azimuthal);
  const y = radius * Math.sin(point.polar) * Math.sin(point.azimuthal);
  const z = radius * Math.cos(point.polar);
  return { x, y, z };
}
