import { fireEvent, screen } from '@testing-library/dom';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { importHtml } from './import-html';

function changeFullscreen(fullscreenElement: Element | null) {
  // @ts-expect-error - mocking a readonly property
  document.fullscreenElement = fullscreenElement;
  fireEvent(document, new Event('fullscreenchange'));
}

document.documentElement.requestFullscreen = vi.fn(async () => {
  changeFullscreen(document.documentElement);
});
document.exitFullscreen = vi.fn(async () => {
  changeFullscreen(null);
});

beforeAll(async () => {
  vi.useFakeTimers();

  document.body.innerHTML = await importHtml();
  await import('../src/fullscreen');
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('fullscreen button enters fullscreen', () => {
  const fullscreen = screen.getByRole('button', {
    name: 'Fullscreen',
    pressed: false,
  });
  fireEvent.click(fullscreen);

  expect(document.fullscreenElement).toBe(document.documentElement);
  expect(fullscreen.textContent).toBe('Exit fullscreen');
  expect(fullscreen.getAttribute('aria-pressed')).toBe('true');
});

test('fullscreen button exists fullscreen', () => {
  changeFullscreen(document.documentElement);

  const fullscreen = screen.getByRole('button', {
    name: 'Exit fullscreen',
    pressed: true,
  });
  fireEvent.click(fullscreen);

  expect(document.fullscreenElement).toBe(null);
  expect(fullscreen.textContent).toBe('Fullscreen');
  expect(fullscreen.getAttribute('aria-pressed')).toBe('false');
});
