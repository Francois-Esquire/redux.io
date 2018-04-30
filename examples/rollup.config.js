import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-re';

import pkg from './package.json';

const external = [].concat(
  Object.keys(pkg.dependencies),
  ['http', 'fs', 'url', 'stream', 'react-dom/server'],
);

const extensions = ['.js', '.jsx'];

const plugins = {
  cjs: {
    vendor: commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': [
          'Component',
          'PureComponent',
          'Fragment',
          'Children',
          'createElement',
        ],
        'node_modules/react-dom/index.js': ['render', 'hydrate'],
      },
    }),
  },
  resolve: {
    vendor: resolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions,
    }),
    bundle: resolve({
      extensions,
    }),
    server: resolve({
      modulesOnly: true,
      extensions,
    }),
  },
  buble: {
    cjs: buble({
      jsx: 'React.createElement',
      objectAssign: 'Object.assign',
    }),
    server: buble({
      transforms: {
        letConst: false,
        arrow: false,
        classes: false,
        templateString: false,
      },
      jsx: 'React.createElement',
      objectAssign: 'Object.assign',
    }),
  },
  replace: {
    vendor: replace({
      patterns: [
        {
          test: 'process.env.NODE_ENV',
          replace: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      ],
    }),
  },
};

const server = {
  external,
  input: 'src/server/app.js',
  output: [{ file: 'index.js', format: 'cjs', interop: false }],
  plugins: [plugins.resolve.server, plugins.buble.server],
};

const vendor = {
  input: 'src/web/vendor.js',
  output: [
    { file: 'public/vendor.js', format: 'iife', name: 'vendor' },
  ],
  plugins: [plugins.replace.vendor, plugins.cjs.vendor, plugins.resolve.vendor],
};

const app = {
  external,
  input: 'src/web/index.js',
  output: [
    {
      file: 'public/bundle.js',
      format: 'iife',
      interop: false,
      freeze: true,
      globals: {
        react: 'vendor.React',
        'react-dom': 'vendor.ReactDom',
        'react-router-dom': 'vendor.ReactRouterDom',
        'react-redux': 'vendor.ReactRedux',
        redux: 'vendor.redux',
        'prop-types': 'vendor.PropTypes',
      },
    },
  ],
  plugins: [plugins.resolve.bundle, plugins.buble.cjs],
};

export default [server, vendor, app];
