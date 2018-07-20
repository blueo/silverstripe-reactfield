import Path from 'path';
// Import the core config
import webpackConfig from '@silverstripe/webpack-config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

const {
  resolveJS,
  externalJS,
  moduleJS,
  pluginJS,
  moduleCSS,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = {
  // the root path, where your webpack.config.js is located.
  ROOT: Path.resolve(),
  // your node_modules folder name, or full path
  MODULES: 'node_modules',
  // relative path from your css files to your other files, such as images and fonts
  FILES_PATH: '../',
  // thirdparty folder containing copies of packages which wouldn't be available on NPM
  THIRDPARTY: 'thirdparty',
  // the root path to your javascript source files
  SRC: Path.resolve('client/src/js'),
};
// CSS path resolution
const PATHS_CSS = Object.assign({}, PATHS, { SRC: Path.resolve('client/src/styles') });

// Resolve modules from admin module eg Injector
function reactFieldResolve(env, paths) {
  const { modules, alias } = resolveJS(env, paths);
  return Object.assign(
    {},
    {
      modules: modules.concat(['../../silverstripe/admin/client/src']),
      alias,
    },
  );
}

const config = [
  {
    name: 'js',
    entry: {
      // React Based js files
      'bundle': 'boot/index.js',
      'entwine': 'entwine/Forms/ReactFieldEntwine.js',
    },
    output: {
      path: Path.join(__dirname, 'client/dist/js'),
      filename: '[name].js',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    resolve: reactFieldResolve(ENV, PATHS),
    externals: externalJS(ENV, PATHS),
    module: moduleJS(ENV, PATHS),
    plugins: pluginJS(ENV, PATHS).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ]),
  },
  {
    name: 'css',
    entry: {
      'styles': 'styles.scss',
    },
    output: {
      path: Path.resolve('client/dist/styles'),
      filename: '[name].css',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    resolve: resolveJS(ENV, PATHS_CSS),
    module: moduleCSS(ENV, PATHS_CSS),
    plugins: [
      new ExtractTextPlugin({ filename: '[name].css' }),
    ],
  },
];

module.exports = config;
