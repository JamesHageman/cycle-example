var path = require('path');

module.exports = {
  context: path.join(__dirname, '/ts_client'),
  entry: [
    './main.ts',
    './index.html'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: true
        }
      },
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.ts$/,
        loader: 'babel!ts-loader',
        exclude: 'node_modules'
      }
    ]
  }
};
