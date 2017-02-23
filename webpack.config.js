const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: './app/js/main.jsx',
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].min.js',
  },

  // resolve: {
  //   alias: {
  //     jquery: "jquery/src/jquery",
  //     materialize: "materialize-css/dist/js/materialize"
  //   },
  // },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'app/js'),
        exclude: path.resolve(__dirname, 'node_modules'),
        options: {
          babelrc: false,
          presets: [
            ['es2015', { modules: false }],
            'react',
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