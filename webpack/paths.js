const path = require("path");

module.exports = {
  src: path.resolve(__dirname, "../src"),
  build: path.resolve(__dirname, "../build"),
  pug: path.resolve(__dirname, "../src/", "pug"),
  vendors: path.resolve(__dirname, "../src/vendors"),
};
