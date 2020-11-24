import test from 'ava';
import { ZERO } from '../../src/worker/math';
import {
  cartesianToSpherical,
  raycastOnSphereToPoint,
  sphericalInterpolate,
  sphericalToCartesian,
} from '../../src/worker/radian-math';
import { closeTo } from './assert';

test('raycastOnSphereToPoint', (t) => {
  t.deepEqual(
    raycastOnSphereToPoint(
      {
        origin: ZERO,
        direction: { x: 0, y: 1, z: 0 },
      },
      1
    ),
    { x: 0, y: 1, z: 0 }
  );

  t.deepEqual(
    raycastOnSphereToPoint(
      {
        origin: ZERO,
        direction: { x: 1, y: 0, z: 0 },
      },
      15
    ),
    { x: 15, y: 0, z: 0 }
  );

  t.deepEqual(
    raycastOnSphereToPoint(
      {
        origin: {
          x: -0.27254772186279297,
          y: 1.426231026649475,
          z: 0.015554174780845642,
        },
        direction: {
          x: 0.5681502185421388,
          y: 0.3375724233702126,
          z: -0.7504999587944574,
        },
      },
      4
    ),
    { x: 15, y: 0, z: 0 }
  );
});

test('sphericalInterpolate', (t) => {
  const interpolate = sphericalInterpolate(
    { theta: 0, phi: 0 },
    { theta: 0, phi: Math.PI }
  );
  t.deepEqual(interpolate(0.5), { theta: 0, phi: Math.PI / 2 });
});

test('cartesianToSpherical', (t) => {
  t.deepEqual(cartesianToSpherical({ x: 1, y: 0, z: 0 }), {
    theta: Math.PI / 2,
    phi: 0,
  });

  t.deepEqual(cartesianToSpherical({ x: 0, y: 1, z: 0 }), {
    theta: 0,
    phi: 0,
  });

  t.deepEqual(cartesianToSpherical({ x: 0, y: -1, z: 0 }), {
    theta: 0,
    phi: 0,
  });
});

test('sphericalToCartesian', (t) => {
  const toX = sphericalToCartesian({ theta: Math.PI / 2, phi: 0 }, 1);
  closeTo(1, toX.x);
  closeTo(0, toX.y);
  closeTo(0, toX.z);

  t.deepEqual(sphericalToCartesian({ theta: 0, phi: 0 }, 1), {
    x: 0,
    y: 1,
    z: 0,
  });
});
