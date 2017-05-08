const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: './app/themes/freiburg-portfolio/static/js/main.js',
  },
  output: {
    path: path.join(__dirname, '/app/themes/freiburg-portfolio/static/js'),
    filename: '[name].min.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '/app/themes/freiburg-portfolio/static/js'),
        exclude: path.resolve(__dirname, '/node_modules'),
        options: {
          babelrc: false,
          presets: [
            ['es2015', { modules: false }],
            'react',
            // 'es2015', 'react'
          ]
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      include: /\.min\.js$/,
      minimize: true,
      comments: false
    }),
  ]
};
