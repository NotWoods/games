import { fireEvent, getByRole } from '@testing-library/dom';
import { readFile } from 'fs/promises';
import { beforeAll, expect, test } from 'vitest';

window.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 0;
};
Element.prototype.animate = (_, options) => {
  const animation = new EventTarget();
  if (typeof options === 'object' && options.delay) {
    setTimeout(
      () => animation.dispatchEvent(new Event('finish')),
      options.delay,
    );
  }

  return animation as Animation;
};

function waitTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

beforeAll(async () => {
  const html = await readFile(new URL('../app.html', import.meta.url), 'utf8');
  const [, body] = html.match(/<body>(.*)<\/body>/ms)!;

  document.body.innerHTML = body;
  await import('../src/main');
});

test('renders hint text', () => {
  const hint = getByRole(document.body, 'alert', {
    name: 'Everyone put a finger on the screen and wait',
  });
  expect(hint).toBeTruthy();
});

test('shows indicator when finger touches screen', async () => {
  const arena = document.getElementById('arena')!;
  const status = getByRole(document.body, 'alert', { name: '' });

  fireEvent.touchStart(arena, {
    targetTouches: [{ identifier: 1, clientX: 100, clientY: 100 }],
  });

  await waitTick();

  expect(status.textContent).toBe('1 finger on the screen');
});
