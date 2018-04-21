const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    './src/styles/main.css',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/build'),
    publicPath: '/build/',
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              'env',
              {
                useBuiltIns: 'usage',
              },
            ],
          ],
          plugins: [
            'babel-plugin-add-module-exports',
            'transform-object-rest-spread',
          ],
        },
      },
      {
        test: /.css$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: isProduction,
              url: false
            },
          },
        ]),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('./styles/main.css'),
    new CopyWebpackPlugin([
      {
        from: './src/icons',
        to: 'icons'
      },
      './src/manifest.json'
    ]),
  ],
  stats: {
    colors: true,
  },
  devtool: !isProduction ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
};
