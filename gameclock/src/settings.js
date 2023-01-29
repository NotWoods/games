// @ts-check

import('./libs.js');

/** @type {HTMLInputElement} */
const startTime = document.querySelector('input[name="start"]');
startTime.addEventListener('change', () => {
  localStorage.setItem('start', startTime.value);
});

// Display the saved time, if any
const setTime = parseInt(localStorage.getItem('start'), 10);
if (!Number.isNaN(setTime)) {
  startTime.value = setTime.toString();
}
