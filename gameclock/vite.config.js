// @ts-check
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import { sharedHtml } from '../vite-plugins/shared-html.mjs';
import { socialMetadata } from '../vite-plugins/social-metadata.mjs';

export default defineConfig({
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
  ],
});
