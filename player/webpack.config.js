const path = require('path');

module.exports = {
  entry: './src/main.ts',
  target: "node",
  output: {
    path: path.resolve(__dirname),
    filename: 'player.js',
  },
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
};