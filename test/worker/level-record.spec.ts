import test from 'ava';
import { GameState, SphericalPoint } from '../../src/worker/level-record';

test('gameState.completeLevel', (t) => {
  const game = new GameState(15);

  t.throws(() => game.completeLevel({ polar: 0, azimuthal: 0 }));

  const audioPosition: SphericalPoint = { polar: 2, azimuthal: 1 };
  const pointerPosition: SphericalPoint = { polar: 1.5, azimuthal: 1.1 };
  game.startLevel(audioPosition, 500);
  t.deepEqual(game.completeLevel(pointerPosition, 590), {
    audio: audioPosition,
    pointer: pointerPosition,
    startTime: 500,
    endTime: 590,
  });
});
