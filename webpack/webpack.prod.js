const { merge } = require("webpack-merge");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

const commonOptions = require("./webpack.common");

module.exports = merge(commonOptions, {
  mode: "production",
  devtool: false,
  plugins: [
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      jpegtran: {
        progressive: true,
      },
      optipng: {
        optimizationLevel: 3,
        interlaced: true,
      },
    }),
  ],
});
