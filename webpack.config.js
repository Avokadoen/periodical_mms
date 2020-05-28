const path = require('path');

module.exports = {
  entry: './assets/scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './'),
  },
  devServer: {
    contentBase: path.join(__dirname, './'),
    compress: true,
    port: 9000
  }
};