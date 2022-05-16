module.exports = {
  plugins: [require("postcss-preset-env"), require("autoprefixer")({ grid: "autoplace" }), require("postcss-merge-longhand")],
};
