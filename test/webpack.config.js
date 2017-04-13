var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function entry(e) {
  if (process.env.POLYFILL) {
    // This option is necessary in mocha-phantomjs 
    return [
      'expose-loader?Promise!./test/polyfill/Promise.js',
      './test/polyfill/Object.assign.js',
      e
    ]
  } else {
    return e
  }
}

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: [ /node_modules/, /polyfill/ ] }
    ]
  },
  entry: {
    'routes': entry('mocha-loader!./test/routes.spec.js')
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].entry.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'routes.html',
      chunks: ['routes'],
      template: './test/template/app.html'
    })
  ]
};
