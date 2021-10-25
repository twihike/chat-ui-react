import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-node-license';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import sizes from 'rollup-plugin-sizes';
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

import pkg from './package.json';

const GLOBAL_NAME = 'ChatUiReact';

const baseGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@mui/material': 'MaterialUI',
};

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * 
 * Copyright (c) 2020 ${pkg.author}. All rights reserved.
 * This source code is licensed under the ${pkg.license} license.
 */`;

const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx'];

const getBaseConfig = ({ nodeEnv, babelEnv }) => ({
  input: 'src/index.ts',
  external: [
    ...Object.keys(baseGlobals),
    ...Object.keys(pkg.devDependencies || {}),
  ],
  plugins: [
    // Resolve node_modules
    resolve({
      extensions,
    }),
    peerDepsExternal(),
    babel({
      envName: babelEnv,
      // sourcemaps: 'inline',
      exclude: /node_modules/,
      extensions,
      babelHelpers: 'runtime',
    }),
    // Convert cjs to esm
    commonjs({ include: /node_modules/ }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    }),
    license({ format: 'jsdoc' }),
    filesize(),
    sizes(),
    process.env.VISUALIZER ? visualizer() : false,
  ],
});

const getConfig = ({ format, nodeEnv, babelEnv, file }) => {
  const nodeEnvConfig = {
    development: { sourcemap: 'inline', plugins: [] },
    production: {
      sourcemap: true,
      plugins: [
        terser({
          output: {
            comments: (node, comment) => {
              const { type, value } = comment;
              return type === 'comment2' && /^!/i.test(value);
            },
          },
        }),
      ],
    },
  };
  const formatConfig = {
    umd: {
      name: GLOBAL_NAME,
    },
    esm: {},
  };

  return {
    ...getBaseConfig({ nodeEnv, babelEnv }),
    output: [
      {
        file,
        format,
        banner,
        globals: baseGlobals,
        ...formatConfig[format],
        ...nodeEnvConfig[nodeEnv],
      },
    ],
  };
};

const getAllConfig = () => {
  const args = [
    {
      format: 'umd',
      nodeEnv: 'development',
      babelEnv: 'rollupUmd',
      file: `dist/browser/${pkg.name}.umd.js`,
    },
    {
      format: 'umd',
      nodeEnv: 'production',
      babelEnv: 'rollupUmd',
      file: `dist/browser/${pkg.name}.umd.min.js`,
    },
    {
      format: 'umd',
      nodeEnv: 'development',
      babelEnv: 'rollupUmdPolyfill',
      file: `dist/browser/${pkg.name}.umd.polyfill.js`,
    },
    {
      format: 'umd',
      nodeEnv: 'production',
      babelEnv: 'rollupUmdPolyfill',
      file: `dist/browser/${pkg.name}.umd.polyfill.min.js`,
    },
    // {
    //   format: 'esm',
    //   nodeEnv: 'development',
    //   babelEnv: 'rollupEsm',
    //   file: `dist/browser/${pkg.name}.esm.js`,
    // },
    // {
    //   format: 'esm',
    //   nodeEnv: 'production',
    //   babelEnv: 'rollupEsm',
    //   file: `dist/browser/${pkg.name}.esm.min.js`,
    // },
    // {
    //   format: 'esm',
    //   nodeEnv: 'development',
    //   babelEnv: 'rollupEsmPolyfill',
    //   file: `dist/browser/${pkg.name}.esm.polyfill.js`,
    // },
    // {
    //   format: 'esm',
    //   nodeEnv: 'production',
    //   babelEnv: 'rollupEsmPolyfill',
    //   file: `dist/browser/${pkg.name}.esm.polyfill.min.js`,
    // },
  ];
  return args.map((a) => getConfig(a));
};

export default getAllConfig();
