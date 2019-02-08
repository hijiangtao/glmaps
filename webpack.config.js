const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./demo.js"],
  module: {
    rules: [
      // configure babel-loader to read .jsx and .js files
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
      },
      // static file loader
      { 
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|csv|json)$/, 
        loader: "file-loader" 
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
