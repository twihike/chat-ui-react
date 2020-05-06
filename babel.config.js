module.exports = function (api) {
  api.cache(true);

  const envNames = [
    'esm',
    'cjs',
    'rollupUmd',
    'rollupUmdPolyfill',
    'rollupEsm',
    'rollupEsmPolyfill',
  ];

  const getPresetEnvOption = (envName) => {
    const options = {
      esm: {
        modules: false,
        targets: {
          node: '12',
        },
      },
      cjs: {
        modules: 'commonjs',
        targets: {
          node: '10',
        },
      },
      rollupUmd: {
        bugfixes: true,
        modules: false,
      },
      rollupUmdPolyfill: {
        bugfixes: true,
        modules: false,
      },
      rollupEsm: {
        bugfixes: true,
        modules: false,
        targets: {
          esmodules: true,
        },
      },
      rollupEsmPolyfill: {
        bugfixes: true,
        modules: false,
        targets: {
          esmodules: true,
        },
      },
    };

    return options[envName];
  };

  const getTransformRuntimeOption = (envName) => {
    const version = '^7.9.0';
    const corejs = {
      version: 3,
      proposals: true,
    };
    const options = {
      esm: {
        useESModules: true,
        version,
      },
      cjs: {
        useESModules: false,
        version,
      },
      rollupUmd: {
        useESModules: true,
        version,
      },
      rollupUmdPolyfill: {
        useESModules: true,
        version,
        corejs,
      },
      rollupEsm: {
        useESModules: true,
        version,
      },
      rollupEsmPolyfill: {
        useESModules: true,
        version,
        corejs,
      },
    };

    return options[envName];
  };

  const getPresets = (envName) => [
    ['@babel/preset-env', getPresetEnvOption(envName)],
    '@babel/preset-react',
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
      },
    ],
  ];

  const getPlugins = (envName) => [
    ['@babel/plugin-transform-runtime', getTransformRuntimeOption(envName)],
    // For typescript
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ];

  return {
    env: envNames.reduce(
      (envOptions, envName) => ({
        ...envOptions,
        [envName]: {
          presets: getPresets(envName),
          plugins: getPlugins(envName),
        },
      }),
      {},
    ),
    sourceMaps: 'inline',
  };
};
