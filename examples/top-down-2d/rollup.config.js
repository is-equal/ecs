/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'dist/main.js',
    format: 'esm',
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        ['process.env.NODE_ENV']: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    typescript(),
    nodeResolve(),
    commonjs(),
    postcss({ extract: true }),
    html(),
  ],
});
