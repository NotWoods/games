// @ts-check
import { trackGoal } from 'fathom-client';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js');
}

export { trackGoal };
