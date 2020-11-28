import test from 'ava';
import { distanceSquared } from '../../src/worker/math';
import { closeTo } from './assert';

test('distanceSquared', (t) => {
  const distSq = distanceSquared(
    { x: -1.662238460495674, y: 3.1631536178355564, z: 1.7410881016267117 },
    { x: -1.2307219371741995, y: 1.512030739326027, z: 3.4927190778376915 }
  );

  closeTo(distSq, 5.980624346658877);
  closeTo(Math.sqrt(distSq), 2.445531505963249);
  t.pass();
});
