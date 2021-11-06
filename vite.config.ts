import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: `Where's the Beep?`,
        short_name: `Where's the Beep`,
        background_color: '#000000',
        theme_color: '#ffffff',
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        paths: {
          three: 'https://threejs.org/build/three.module.js',
        },
      },
    },
  },
});
