const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./demo.js"],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'index.html'
    })
  ],
  node: {
    fs: "empty"
  }
};
