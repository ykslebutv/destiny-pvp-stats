/*
to minify code as app.min.js run:
minify=true ./node_modules/.bin/webpack
*/

var webpack = require('webpack');
var path = require('path');
var babiliPlugin = require("babili-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, './src');

var outputFile = 'app.js';
var plugins = [];

if (process.env.minify) {
  outputFile = 'app.min.js';
  plugins.push(new babiliPlugin);
}

console.log(outputFile);

var config = {
  context: BUILD_DIR,
  entry: [
    './main.jsx'
  ],
  output: {
    path: BUILD_DIR,
    filename: outputFile
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : BUILD_DIR,
        loader : 'babel',
        query:
	      {
          presets:['react', 'es2015', "stage-0"],
          plugins: ['transform-decorators-legacy' ]
	      }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: plugins
};

module.exports = config;
