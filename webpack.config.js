const chalk = require('chalk');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const threadLoader = require('thread-loader');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');


const jsWorkerOptions = {
  workers: require('os').cpus().length - 1,
  workerParallelJobs: 50,
  poolTimeout: 2000,
  poolParallelJobs: 50,
  name: 'js-pool'
};
threadLoader.warmup(jsWorkerOptions, ['babel-loader']);


module.exports = {
  mode: process.env.NODE_ENV || "development",
  watch: false,
  watchOptions: {
    ignored: /node_modules/
  },
  devtool: 'source-map',
  entry: {
    index: ['babel-polyfill', './frontend/assets/scripts/index.js']
  },
  output: {
    path: path.join(__dirname, './wordpress/assets'),
    publicPath: '/assets',
    filename: 'js/[name].js'
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./.dll/vendor-manifest.json')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyWebpackPlugin(
      [
        {
          from: '',
          to: '../__templates/',
          ignore: [
            '!*.html'
          ]
        },
      ],
      { context: 'frontend' }
    ),
    new CopyWebpackPlugin(
      [
        {
          from: '',
          to: 'images/',
        },
      ],
      { context: 'frontend/assets/images' }
    ),
    new WriteFilePlugin(),
    function () {
      this.hooks.watchRun.tapAsync('MyWatchRunPlugin', (watching, callback) => {
        console.log('\033[36m' + 'Begin compile at ' + new Date() + ' \033[39m');
        callback();
      })
    },
    new ProgressBarPlugin({
      format: `  ${chalk.cyan.bold('build')} [:bar] ${chalk.green.bold(':percent')} | :msg (:elapsed seconds) `,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')({
                  grid: true,
                  browsers: ['last 2 versions']
                }),
                require('cssnano'),
                require('css-mqpacker'),
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {loader: 'cache-loader'},
          {loader: 'thread-loader', options: jsWorkerOptions},
          {
            loader: 'babel-loader?cacheDirectory',
            options: {
              presets: [
                [
                  'env',
                  {
                    modules: false,
                    targets: {browsers: ['last 2 versions', 'safari >= 7']}
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'wordpress'),
    port: 8080,
  },
};
