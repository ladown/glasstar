const { merge } = require('webpack-merge');

const common = require('./webpack.common');
const paths = require('./paths');

module.exports = merge(common, {
	mode: 'development',

	devtool: 'eval-cheap-source-map',

	devServer: {
		static: paths.src,
		compress: true,
		port: 'auto',
		open: true,
		historyApiFallback: true,
	},
});
