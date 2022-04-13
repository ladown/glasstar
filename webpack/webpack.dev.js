const { merge } = require("webpack-merge");

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-source-map",
  devServer: {
    compress: true,
    port: "auto",
    open: true,
    historyApiFallback: true,
    hot: true,
  },
});
