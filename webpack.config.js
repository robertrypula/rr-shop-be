const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const packageJson = require('./package.json');
const libraryName = packageJson.name
  .toLowerCase()
  .split('-')
  .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1))
  .join('');

const externals = [
  'bcryptjs',
  'body-parser',
  'class-transformer',
  'class-validator',
  'cors',
  'express',
  'googleapis',
  'helmet',
  'jsonwebtoken',
  'md5',
  'mysql',
  'nodemailer',
  'reflect-metadata',
  'request-promise-native',
  'typeorm',
  'uuid'
];

/*
const relativePaths = () => {
  const paths = require('./tsconfig').compilerOptions.paths;
  const getFullPath = lastPart => path.join(__dirname, 'src/lib', lastPart);
  const result = {};

  Object.keys(paths).forEach(key =>
    key === '@'
      ? (result['@'] = getFullPath('index'))
      : (result[key.replace('/*', '')] = getFullPath(paths[key][0].replace('/*', '')))
  );

  return result;
};
*/

function getConfig(env) {
  return {
    entry: { [`${packageJson.name}-v${packageJson.version}`]: './src/index.ts' },
    externals: externals.reduce((previous, value) => ((previous[value] = value), previous), {}),
    module: {
      rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }]
    },
    node: {
      __dirname: false,
      __filename: false
    },
    output: {
      filename: '[name].js',
      library: libraryName,
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      globalObject: 'this'
    },
    plugins: [
      new webpack.DefinePlugin({
        DEVELOPMENT: JSON.stringify(env.DEVELOPMENT === true),
        PRODUCTION: JSON.stringify(env.PRODUCTION === true)
      })
    ],
    resolve: {
      // alias: { ...relativePaths() },
      extensions: ['.ts', '.js']
    },
    target: 'node'
  };
}

function fillDev(config) {
  config.mode = 'development';
  config.devtool = 'inline-source-map';
}

function fillProd(config, env) {
  config.mode = 'production';
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
          output: {
            comments: false
          }
        }
      })
    ]
  };
  env.ANALYZER && config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = env => {
  const config = getConfig(env);

  if (env.DEVELOPMENT === true) {
    fillDev(config);
  } else if (env.PRODUCTION === true) {
    fillProd(config, env);
  } else {
    throw 'Please set the environment!';
  }

  return config;
};
