// @ts-check
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { socialMetadata } from '../vite-plugins/social-metadata.mjs';

export default defineConfig({
  base: '/last-finger-standing/',
  server: {
    host: '0.0.0.0',
  },
  build: {
    outDir: '../dist/last-finger-standing',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        landing: 'index.html',
        app: 'app.html',
      },
    },
  },
  plugins: [
    socialMetadata({
      title: 'Last Finger Standing',
      description:
        'Need to pick someone to go first? To pay the bill? To buy milk? Just have everyone put a finger on the screen and wait. Last Finger Standing will make your choice automatically! A quick and easy app to randomly select someone from a group of people.',
      image:
        'https://games.tigeroakes.com/last-finger-standing/social_image.png',
      twitterSite: '@Not_Woods',
    }),
    VitePWA({ registerType: 'autoUpdate', manifest: false }),
  ],
});
