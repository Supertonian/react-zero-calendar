import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// Seamless integration between Rollup and PostCSS.
import postcss from 'rollup-plugin-postcss';
// A Rollup plugin which imports JPG, PNG, GIF, SVG, and WebP files.
import image from '@rollup/plugin-image';
// A Rollup plugin which Converts .json files to ES6 modules.
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: './src/main.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    json(),
    postcss(),
    babel({
      plugins: [],
      exclude: 'node_modules/**',
    }),
    commonjs(),
    image(),
    typescript({ typescript: require('typescript') }),
  ],
};
