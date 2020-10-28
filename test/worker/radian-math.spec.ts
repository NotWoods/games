import test from "ava";
import floatEqual from "float-equal";
import {
  cartesianToSpherical,
  sphericalInterpolate,
  sphericalToCartesian,
} from "../../src/worker/radian-math";

function closeTo(actual: number, expected: number, message?: string) {
  if (!floatEqual(actual, expected)) {
    throw new Error(message || `${actual} is not close to ${expected}`);
  }
}

test("sphericalInterpolate", (t) => {
  const interpolate = sphericalInterpolate(
    { polar: 0, azimuthal: 0 },
    { polar: 0, azimuthal: Math.PI }
  );
  t.deepEqual(interpolate(0.5), { polar: 0, azimuthal: Math.PI / 2 });
});

test("cartesianToSpherical", (t) => {
  t.deepEqual(
    cartesianToSpherical({ x: 1, y: 0, z: 0 }),
    { polar: Math.PI / 2, azimuthal: 0 }
  );

  t.deepEqual(
    cartesianToSpherical({ x: 0, y: 1, z: 0 }),
    { polar: 0, azimuthal: 0 }
  );

  t.deepEqual(
    cartesianToSpherical({ x: 0, y: -1, z: 0 }),
    { polar: 0, azimuthal: 0 }
  );
});

test("sphericalToCartesian", (t) => {
  const toX = sphericalToCartesian({ polar: Math.PI / 2, azimuthal: 0 }, 1)
  closeTo(1, toX.x);
  closeTo(0, toX.y);
  closeTo(0, toX.z);

  t.deepEqual(
    sphericalToCartesian({ polar: 0, azimuthal: 0 }, 1),
    { x: 0, y: 1, z: 0 }
  );
});
