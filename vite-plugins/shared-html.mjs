import { insertHtml, h } from 'vite-plugin-insert-html';

/**
 * @returns {import('vite').Plugin}
 */
export const sharedHtml = () =>
  insertHtml({
    head: [
      h('script', {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'FMVLGCSF',
        'data-honor-dnt': 'true',
        defer: true,
      }),
    ],
  });
