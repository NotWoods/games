import { fireEvent, screen } from '@testing-library/dom';
import { readFile } from 'fs/promises';
import { beforeAll, expect, test, vi } from 'vitest';

window.requestAnimationFrame = (callback) => {
  setTimeout(callback, 1000 / 60);
  return 0;
};
navigator.vibrate = vi.fn(() => true);
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

beforeAll(async () => {
  const html = await readFile(new URL('../app.html', import.meta.url), 'utf8');
  const [, body] = html.match(/<body>(.*)<\/body>/ms)!;

  vi.useFakeTimers();

  document.body.innerHTML = body;
  await import('../src/main');
});

test('renders hint text', () => {
  const hint = screen.getByRole('alert', {
    name: 'Everyone put a finger on the screen and wait',
  });
  expect(hint).toBeTruthy();
});

test('shows indicator when finger touches screen', async () => {
  const arena = screen.getByTestId('arena');

  fireEvent.touchStart(arena, {
    targetTouches: [{ identifier: 1, clientX: 100, clientY: 100 }],
  });
  vi.advanceTimersByTime(17);

  expect(arena.children).toHaveLength(1);

  fireEvent.touchStart(arena, {
    targetTouches: [
      { identifier: 1, clientX: 100, clientY: 100 },
      { identifier: 2, clientX: 300, clientY: 300 },
    ],
  });
  vi.advanceTimersByTime(17);
  expect(arena.children).toHaveLength(2);
});

test('picks finger after 2 seconds', async () => {
  const arena = screen.getByTestId('arena');
  const status = screen.getByRole('alert', { name: '' });

  fireEvent.touchStart(arena, {
    targetTouches: [
      { identifier: 1, clientX: 100, clientY: 100 },
      { identifier: 2, clientX: 300, clientY: 300 },
    ],
  });
  vi.advanceTimersByTime(17);

  expect(arena.children).toHaveLength(2);

  vi.advanceTimersByTime(2000);
  expect(status.textContent).toContain('Picked finger ');
});
