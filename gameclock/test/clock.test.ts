import { fireEvent, screen } from '@testing-library/dom';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

beforeAll(async () => {
  const filename = fileURLToPath(import.meta.url);
  const html = await readFile(resolve(filename, '../../index.html'), 'utf8');
  const [, body] = html.match(/<body>(.*)<\/body>/ms)!;

  vi.useFakeTimers();

  document.body.innerHTML = body;
  // @ts-expect-error - importing non-module
  await import('../src/clock.js');
});

beforeEach(async () => {
  const resetButton = screen.getByRole('button', { name: 'Reset' });
  fireEvent.click(resetButton);
});

test('renders clock buttons with initial time', () => {
  const buttons = screen.getAllByText('1:00');
  expect(buttons).toHaveLength(2);
});

test('other clock becomes active on click', async () => {
  const buttons = screen.getAllByRole('button', { pressed: true });
  expect(buttons).toHaveLength(2);

  fireEvent.click(buttons[0]);
  expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  expect(buttons[1].getAttribute('aria-pressed')).toBe('false');

  fireEvent.click(buttons[1]);
  expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
  expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
});

test('pause button stops both clocks', async () => {
  const clockButtons = screen.getAllByRole('button', { pressed: true });
  expect(clockButtons).toHaveLength(2);

  expect(screen.queryByRole('button', { name: 'Pause' })).toBeNull();

  fireEvent.click(clockButtons[0]);
  expect(clockButtons[0].getAttribute('aria-pressed')).toBe('true');
  expect(clockButtons[1].getAttribute('aria-pressed')).toBe('false');

  const pauseButton = screen.getByRole('button', { name: 'Pause' });
  fireEvent.click(pauseButton);
  expect(clockButtons[0].getAttribute('aria-pressed')).toBe('true');
  expect(clockButtons[1].getAttribute('aria-pressed')).toBe('true');

  expect(screen.queryByRole('button', { name: 'Pause' })).toBeNull();
});
