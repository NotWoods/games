import { vi } from 'vitest';

// Mock out functions not provided by JSDOM

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
