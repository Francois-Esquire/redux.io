import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: '.build/react.js',
    external: ['react', 'socket.io-client'],
    output: [
      { file: 'dist/react.js', format: 'cjs', exports: 'named' },
      { file: 'dist/react.mjs', format: 'es' },
    ],
  },
  {
    input: '.build/react.d.ts',
    external: ['react', 'socket.io-client'],
    plugins: [dts()],
    output: [
      { file: 'dist/react.d.ts', format: 'es' },
      { file: 'dist/react.d.mts', format: 'es' },
    ],
  },
  {
    input: '.build/index.js',
    external: ['react', 'react-redux'],
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      resolve(),
      commonjs(),
    ],
    output: [
      { file: 'dist/redux.io.js', format: 'cjs', exports: 'named' },
      { file: 'dist/redux.io.mjs', format: 'es' },
      { file: 'dist/redux.io.es.js', format: 'es' },
      {
        file: 'dist/redux.io.umd.js',
        format: 'umd',
        name: 'redux.io',
        globals: { react: 'React', 'react-redux': 'ReactRedux' },
      },
    ],
  },
  {
    input: '.build/index.d.ts',
    external: ['react', 'redux', 'socket.io-client'],
    plugins: [dts()],
    output: [
      { file: 'dist/redux.io.d.ts', format: 'es' },
      { file: 'dist/redux.io.d.mts', format: 'es' },
    ],
  },
];
