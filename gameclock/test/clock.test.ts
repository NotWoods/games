import {
  getAllByText,
  getAllByRole,
  fireEvent,
  queryByRole,
  getByRole,
} from '@testing-library/dom';
import { readFile } from 'fs/promises';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

vi.spyOn(window, 'confirm').mockImplementation(() => true);

beforeAll(async () => {
  const html = await readFile(
    new URL('../index.html', import.meta.url),
    'utf8',
  );
  const [, body] = html.match(/<body>(.*)<\/body>/ms)!;

  vi.useFakeTimers();

  document.body.innerHTML = body;
  // @ts-expect-error
  await import('../src/clock.js');
});

beforeEach(async () => {
  const resetButton = getByRole(document.body, 'button', { name: 'Reset' });
  fireEvent.click(resetButton);
});

test('renders clock buttons with initial time', () => {
  const buttons = getAllByText(document.body, '1:00');
  expect(buttons).toHaveLength(2);
});

test('other clock becomes active on click', async () => {
  const buttons = getAllByRole(document.body, 'button', { pressed: true });
  expect(buttons).toHaveLength(2);

  fireEvent.click(buttons[0]);
  expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  expect(buttons[1].getAttribute('aria-pressed')).toBe('false');

  fireEvent.click(buttons[1]);
  expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
  expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
});

test('pause button stops both clocks', async () => {
  const clockButtons = getAllByRole(document.body, 'button', { pressed: true });
  expect(clockButtons).toHaveLength(2);

  expect(queryByRole(document.body, 'button', { name: 'Pause' })).toBeNull();

  fireEvent.click(clockButtons[0]);
  expect(clockButtons[0].getAttribute('aria-pressed')).toBe('true');
  expect(clockButtons[1].getAttribute('aria-pressed')).toBe('false');

  const pauseButton = getByRole(document.body, 'button', { name: 'Pause' });
  fireEvent.click(pauseButton);
  expect(clockButtons[0].getAttribute('aria-pressed')).toBe('true');
  expect(clockButtons[1].getAttribute('aria-pressed')).toBe('true');

  expect(queryByRole(document.body, 'button', { name: 'Pause' })).toBeNull();
});
