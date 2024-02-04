// @ts-check
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { sharedHtml } from '../vite-plugins/shared-html.mjs';

export default defineConfig({
  base: '/wheres-the-beep/',
  build: {
    outDir: '../dist/wheres-the-beep',
    emptyOutDir: true,
    chunkSizeWarningLimit: 650,
  },
  plugins: [
    sharedHtml(),
    VitePWA({
      manifest: {
        name: `Where's the Beep?`,
        short_name: `Where's the Beep`,
        background_color: '#000000',
        theme_color: '#ffffff',
      },
    }),
  ],
});
