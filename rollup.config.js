// @ts-check
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import consts from 'rollup-plugin-consts';

/** @type {import('rollup').RollupOptions} */
const main = {
  input: 'src/main/index.ts',
  output: {
    dir: 'dist/main',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript({ module: 'esnext' }),
    nodeResolve(),
    consts({ workerUrl: 'dist/worker/index.js' }),
  ],
};

/** @type {import('rollup').RollupOptions} */
const worker = {
  input: 'src/worker/index.ts',
  output: {
    file: 'dist/worker/index.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [typescript({ module: 'esnext' }), nodeResolve()],
};

export default [main, worker];
