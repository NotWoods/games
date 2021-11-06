import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      external: [
        'three',
        'https://threejs.org/build/three.module.js',
        'https://threejs.org/examples/jsm/geometries/TextGeometry.js',
        'https://threejs.org/examples/jsm/loaders/FontLoader.js',
        'https://threejs.org/examples/jsm/webxr/VRButton.js',
        'https://threejs.org/examples/jsm/webxr/XRControllerModelFactory.js',
      ],
      output: {
        paths: {
          three: 'https://threejs.org/build/three.module.js',
        },
      },
    },
  },
});
