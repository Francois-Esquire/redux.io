import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
  input: 'lib/index.js',
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
};
