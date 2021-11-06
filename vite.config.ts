import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      output: {
        paths: {
          three: 'https://threejs.org/build/three.module.js',
        },
      },
    },
  },
});
