const fs = require("fs");
const path = require("path");
const paths = require("./paths");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pugTemplates = [];
const srcPugFiles = fs.readdirSync(`${paths.pug}`);
srcPugFiles.forEach((s) => s.endsWith(".pug") && pugTemplates.push(s));

module.exports = {
  entry: ["@babel/polyfill", `${paths.src}/js/index.js`],
  output: {
    path: paths.build,
    filename: "js/[name].js",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => `css/${chunk.name.replace("/js/", "/css/")}.css`,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${paths.src}/img`,
          to: `${paths.build}/img`,
          globOptions: {
            ignore: ["backgrounds/*.*"],
          },
        },
      ],
    }),
    ...pugTemplates.map((file) => {
      return new HtmlWebpackPlugin({
        template: `${paths.pug}/${file}`,
        filename: path.join(paths.build, file.replace(".pug", ".html")),
        inject: "body",
        alwaysWriteToDisk: true,
      });
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          { loader: "raw-loader" },
          {
            loader: "pug-html-loader",
            options: {
              pretty: true,
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: [/(node_modules|bower_components)/, `${paths.vendors}/vendor.js`],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(woff(2)?|ttf(2)?|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg?)$/i,
        exclude: /(node_modules|bower_components)/,
        type: "asset",
        generator: {
          filename: "img/backgrounds/[name][ext]",
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
  },
};
