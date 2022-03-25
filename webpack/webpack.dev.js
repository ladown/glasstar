const { merge } = require("webpack-merge");

const common = require("./webpack.common");
const { src } = require("./paths");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: `${src}/*.*`,
    compress: true,
    port: "auto",
    open: true,
    historyApiFallback: true,
    hot: true,
  },
});
