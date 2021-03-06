/* global __dirname, module, process, require */

var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'react-hot', 'babel' ],
        include: path.join(__dirname, 'src'),
      },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
    ],
  },
  resolve: {
    root: path.resolve(__dirname),
     alias: {
       components: 'src/components',
       style: 'src/style',
       utils: 'src/utils',
       config: path.join(__dirname, 'config', process.env.NODE_ENV),
     },
     extensions: ['', '.js', '.styl'],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    bufferutil: 'empty',
  },
}
