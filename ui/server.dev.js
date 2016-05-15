/* global require */

var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

var port = process.env.NODE_ENV === `production` ? 80 : 3000

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
}).listen(port, 'localhost', (err) => {
  if (err) console.log(err)

  console.log(`Listening at localhost:${port}`)
})
