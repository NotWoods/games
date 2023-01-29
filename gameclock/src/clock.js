// @ts-check
/** @typedef {ReturnType<typeof initClock>} Clock */

const libModule = import('./libs.js');

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MIN = 60;
const SETTINGS_STARTING_SECONDS = parseInt(localStorage.getItem('start'), 10);
const STARTING_SECONDS = Number.isNaN(SETTINGS_STARTING_SECONDS)
  ? 60
  : SETTINGS_STARTING_SECONDS;
const STARTING_MILLISECONDS = STARTING_SECONDS * MILLISECONDS_PER_SECOND;

let activeIndex = -1;
const clocks = [initClock('clock--top'), initClock('clock--bottom')];

/** @type {HTMLButtonElement} */
const pause = document.querySelector('.button--pause');
/** @type {HTMLButtonElement} */
const reset = document.querySelector('.button--reset');

function initClock(className) {
  /** @type {HTMLButtonElement} */
  const button = document.querySelector(`.${className}`);
  /** @type {HTMLTimeElement} */
  const display = button.querySelector('.clock');

  return {
    // Reference to button container element
    button,
    // Reference to time element with text inside
    display,
    // If false, then the clock is paused
    active: false,
    // Milliseconds that elapsed before pausing
    elapsedSoFar: 0,
    // Exact time that the clock was paused last, or started. -1 means reset.
    lastPaused: -1,
    // Last value (in seconds) that was rendered
    lastDisplayed: -1,
  };
}

/**
 * Returns time on the clock that has elapsed, in milliseconds
 * @param {Clock} clock Clock with `lastPaused` set.
 * @param {number} now Current time in milliseconds.
 */
function getDuration(clock, now) {
  if (!clock.active) {
    return clock.elapsedSoFar;
  } else if (clock.lastPaused !== -1) {
    return now - clock.lastPaused + clock.elapsedSoFar;
  } else {
    return 0;
  }
}

/**
 * Pauses countdown timer for the given clock
 * @param {Clock} clock
 * @param {number} now Current time in milliseconds.
 */
function pauseClock(clock, now) {
  // Remove class from previously active clock
  clock.display.classList.remove('clock--active');

  if (clock.lastPaused !== -1) {
    clock.elapsedSoFar = getDuration(clock, now);
  }
  clock.active = false;
  clock.lastPaused = now;
}
function pauseAll(now = Date.now()) {
  activeIndex = -1;
  pause.hidden = true;
  clocks.forEach((clock) => pauseClock(clock, now));
}

/**
 * Bound click event listener for clock buttons.
 * Changes the currently active timer.
 * @param {number} index Index of clicked clock
 */
function switchActive(index, now = Date.now()) {
  // Index of next clock to activate
  let nextIndex = index + 1;
  if (nextIndex >= clocks.length) nextIndex = 0;

  if (activeIndex === -1) {
    // If no clock is active...
    pause.hidden = false;

    if (clocks[nextIndex].lastPaused === -1) {
      // Track when a timer is started after reset (or first time)
      libModule.then(({ trackGoal }) => trackGoal('7GNS1PRY', 0));
    }
  } else if (activeIndex === nextIndex) {
    // Clock is already activated
    return;
  } else {
    // Pause the currently active clock
    pauseClock(clocks[activeIndex], now);
  }

  clocks[nextIndex].display.classList.add('clock--active');
  activeIndex = nextIndex;

  // Start the timer
  clocks[nextIndex].active = true;
  clocks[nextIndex].lastPaused = now;
}
clocks.forEach((clock, index) => {
  const event = 'onpointerdown' in clock.button ? 'pointerdown' : 'click';
  clock.button.addEventListener(event, () => switchActive(index));
});

pause.addEventListener('click', () => pauseAll());
reset.addEventListener('click', () => {
  pauseAll();
  if (window.confirm('Are you sure you want to reset the timers?')) {
    clocks.forEach((clock) => {
      clock.elapsedSoFar = 0;
      clock.lastPaused = -1;
    });
  }
});

/**
 * Renders the current time on the clock
 * @param {Clock} clock
 */
function renderClockNumber(clock, now = Date.now()) {
  const duration = STARTING_MILLISECONDS - getDuration(clock, now);
  const seconds = Math.max(0, Math.floor(duration / MILLISECONDS_PER_SECOND));

  // Don't re-render if the same second count will be displayed
  if (seconds === clock.lastDisplayed) return;
  const min = String(Math.floor(seconds / SECONDS_PER_MIN));
  const sec = String(seconds % SECONDS_PER_MIN);
  clock.display.textContent = `${min}:${sec.padStart(2, '0')}`;
  clock.display.dateTime = `PT${min}M${sec}S`;
  clock.lastDisplayed = seconds;

  if (seconds === 0) {
    // If reached 0 for the first time...
    navigator.vibrate(200);
  }
}
requestAnimationFrame(function renderLoop() {
  const now = Date.now();
  clocks.forEach((clock) => renderClockNumber(clock, now));
  requestAnimationFrame(renderLoop);
});
