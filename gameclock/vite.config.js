// @ts-check
import legacy from '@vitejs/plugin-legacy';
import { defineProject } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import { sharedHtml } from '../vite-plugins/shared-html.mjs';
import { socialMetadata } from '../vite-plugins/social-metadata.mjs';

export default defineProject({
  base: '/gameclock/',
  build: {
    outDir: '../dist/gameclock',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        settings: 'settings.html',
      },
    },
  },
  plugins: [
    sharedHtml(),
    socialMetadata({
      title: 'GameClock',
      description: 'Time your chess games, jenga games, and other board games.',
      url: 'https://games.tigeroakes.com/gameclock/',
      image: 'https://games.tigeroakes.com/gameclock/icons/github_social.png',
      twitterSite: '@Not_Woods',
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    VitePWA({
      manifest: false,
      workbox: {
        cacheId: 'gameclock',
        ignoreURLParametersMatching: [/fbclid/],
        dontCacheBustURLsMatching: new RegExp('^assets/'),
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['test/setup.ts'],
  },
});
