// some of the code below derived from
// https://github.com/philipwalton/rollup-native-modules-boilerplate/blob/master/rollup.config.js
// which is covered by the Apache 2.0 @licence http://www.apache.org/licenses/LICENSE-2.0
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import 'core-js';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
// import { eslint } from "rollup-plugin-eslint";
// import path from 'path';

function getRollupBasePlugins({targetEsModules = false}) {
  const targets = targetEsModules
    ? { esmodules: true }
    // : { browsers: ['last 2 Chrome versions', 'last 2 Safari versions', 'last 2 iOS versions', 'last 2 Edge versions', 'Firefox ESR' ] };
    : { browsers: ['ie 11'] };
  const plugins = [
    resolve(),
    commonjs(),
    // replace({'process.env.NODE_ENV': JSON.stringify('production')}),
    terser({
      sourcemap: true,
    }),
    babel({
      exclude: /node_modules\/core-js/,
      presets: [['@babel/preset-env', {
        targets,
        useBuiltIns: 'usage',
        debug: false,
        corejs: 3,
      }]],
    })
  ];
  return plugins;
}

const moduleConfig = [
  // Module config for <script type="module">
  {
    input: 'src/gest-age.module.js',
    output: {
      dir: 'docs/dist',
      format: 'esm',
      dynamicImportFunction: '__import__',
      sourcemap: true,
    },
    plugins: [
      ...getRollupBasePlugins({ targetEsModules: true }),
      del({ targets: 'docs/dist/*' })
    ]
  },
  // Legacy config for <script nomodule>
  {
    input: 'src/gest-age.nomodule.js',
    output: {
      file: 'docs/dist/gest-age.nomodule.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: getRollupBasePlugins({ targetEsModules: false }),
    inlineDynamicImports: true,
  },
];

export default moduleConfig;
